from RL.environment.parametrs import *
from RL.environment.game import *
from RL.environment.plot import *
from RL.algorithms.DQN.DQN import DQNAgent
import random
import torch.optim as optim
import torch
from RL.algorithms.DQN.bayesOpt import *
from flask_socketio import SocketIO, emit
import time


def generate_weights_name(params):
	file_name = "weights"
	file_name+='_arch'+''.join(["_"+str(el) for el in params['layer_size']])
	file_name+= '_par1_'+str(format(params['epsilon_decay_linear'], '.6f'))
	file_name+= '_par2_'+str(format(params['learning_rate'], '.6f'))
	file_name+= '_par3_'+str(params['memory_size'])
	file_name+= '_par4_'+str(params['batch_size'])
	file_name+='.h5'
	print(file_name)
	return file_name


def initialize_game(player, game, food, agent, batch_size):
	state_init1 = get_state(game, player, food)  # [0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0]
	action = [1, 0, 0]
	player.do_move(action, player.x, player.y, game, food)
	state_init2 = get_state(game, player, food)
	reward1 = agent.set_reward(player, game.crash)
	agent.remember(state_init1, action, reward1, state_init2, game.crash)
	agent.replay_new(agent.memory, batch_size)


def test(params,socketio):
	params['load_weights'] = True
	params['train'] = False
	params["test"] = False
	score, mean, stdev = run(params,socketio)
	return score, mean, stdev

stop_game_from_client = False
no_plot_from_client = False

def run(params,socketio):
	"""
	Run the DQN algorithm, based on the parameters previously set.
	"""
	pygame.init()
	if params['displayJS']==False or params['displayJS']==True:
		pygame.display.iconify()
	agent = DQNAgent(params)
	agent = agent.to(DEVICE)
	agent.optimizer = optim.Adam(agent.parameters(), weight_decay=0, lr=params['learning_rate'])
	counter_games = 0
	score_plot = []
	counter_plot = []
	record = 0
	total_score = 0
	step = 0
	global stop_game_from_client, no_plot_from_client

	while counter_games < params['episodes']:
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				pygame.quit()
				quit()
		# Initialize classes
		game = Game(440, 440)
		player1 = game.player
		food1 = game.food

		# Perform first move
		initialize_game(player1, game, food1, agent, params['batch_size'])
		if params['displayPY']:
			display(player1, food1, game, record, counter_games, step)

		while not game.crash:
			if no_plot_from_client:
				break
			if not params['train']:
				agent.epsilon = 0.01
			else:
				# agent.epsilon is set to give randomness to actions
				agent.epsilon = 1 - (counter_games * params['epsilon_decay_linear'])

			# get old state
			state_old = get_state(game, player1, food1)

			# perform random actions based on agent.epsilon, or choose the action
			if random.uniform(0, 1) < agent.epsilon:
				final_move = np.eye(3)[randint(0, 2)]
			else:
				# predict action based on the old state
				with torch.no_grad():
					state_old_tensor = torch.tensor(state_old.reshape((1, 11)), dtype=torch.float32).to(DEVICE)
					prediction = agent(state_old_tensor)
					final_move = np.eye(3)[np.argmax(prediction.detach().cpu().numpy()[0])]

			# perform new move and get new state
			player1.do_move(final_move, player1.x, player1.y, game, food1)
			step += 1
			if player1.eaten:
				step = 0
			state_new = get_state(game, player1, food1)

			if step > 100:
				game.crash = True

			# set reward for the new state
			reward = agent.set_reward(player1, game.crash)

			if params['train']:
				# train short memory based on the new action and state
				# store the new data into a long term memory
				agent.train_short_memory(state_old, final_move, reward, state_new, game.crash)
				agent.remember(state_old, final_move, reward, state_new, game.crash)
			record = get_record(game.score, record)
			if params['displayPY']:
				display(player1, food1, game, record, counter_games, step)
				pygame.time.wait(params['speed'])
			if params['displayJS']:
				time.sleep(params['speed']/1000)


			# pass data to client
			if params['displayJS']:
				data_pp = [[x[0]//20,x[1]//20] for x in player1.position]
				data_fp = [food1.x_food//20, food1.y_food//20]
				data_game = counter_games
				data_step = step
				data_score = game.score
				data_max = record
				socketio.emit('getCoords', {'data_pp':data_pp, 'data_fp':data_fp, 'data_game':data_game, 
				'data_step':data_step,'data_score':data_score,'data_max':data_max})
			else:
				data_game = counter_games
				data_step = step
				data_score = game.score
				data_max = record
				socketio.emit('getOnlyStats', {'data_game':data_game, 
				'data_step':data_step,'data_score':data_score,'data_max':data_max})
		if no_plot_from_client==False:
			if params['train']:
				agent.replay_new(agent.memory, params['batch_size'])
			counter_games += 1
			step = 0
			total_score += game.score
			score_plot.append(game.score)
			counter_plot.append(counter_games)
		print("stop_game_from_client: ",stop_game_from_client)
		print("no_plot_from_client: ",no_plot_from_client)
		if stop_game_from_client:
			break

	mean = 0
	stdev = 0
	if no_plot_from_client==False:
		print("Score plot: ", score_plot)
		if len(score_plot)>1:
			mean, stdev = get_mean_stdev(score_plot)
		if params['train']:
			model_weights = agent.state_dict()
			if params['weights_par_name']:
				params['weights_name'] = params['weights_dqn_folder']+generate_weights_name(params)
				torch.save(model_weights, params['weights_name'])
				socketio.send(generate_weights_name(params))
			else:
				torch.save(model_weights, params['weights_dqn_folder']+params['weights_name'])
				
	if params['plot_score']:
		print(len(score_plot))
		if (no_plot_from_client or len(score_plot)<=1):
			print("dont generate plot")
			socketio.send('Not enough data for plot.')
		else:
			print("generate plot")
			plot_seaborn(counter_plot, score_plot, params['train'])
			socketio.send('Picture generated.')
	no_plot_from_client = False
	stop_game_from_client = False
	return total_score, mean, stdev


def DQN_run(display, speed, train, params, socketio):
	print(__name__)
	# Set options to activate or deactivate the game view, and its speed
	pygame.font.init()
	if train:
		params['train'] = True
		params['test'] = False
	else:
		params['train'] = False
		params['test'] = True
	params['displayPY'] = display
	params['speed'] = speed
	if params['train']:
		params['load_weights'] = False
		run(params,socketio)
	if params['test']:
		params['train'] = False
		params['load_weights'] = True
		test(params,socketio)
