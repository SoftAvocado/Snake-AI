import datetime

DEVICE = 'cpu'  # 'cuda' if torch.cuda.is_available() else 'cpu'

def define_parameters():
	params = dict()
	#General
	params['episodes'] = 100				# Amount of games
	# Neural Network
	params['input_size'] = 11
	params['layer_size'] = [100, 50, 20]
	params['output_size'] = 3 
	# Q-learning Network
	params['epsilon_decay_linear'] = 1/400
	params['learning_rate'] = 0.00013629
	params['memory_size'] = 2000
	params['batch_size'] = 10
	# Settings
	params['displayJS'] = True				# Use JS interface
	params['displayPY'] = False				# Use Pygame interface
	params['speed'] = 50
	params['load_weights'] = False
	params['train'] = True					# Train mode
	params['test'] = False					# Game mode
	params['plot_score'] = True				# Make result plot after train/game
	params['weights_dqn_folder'] = 'static/weights/'
	params['weights_name'] = 'weights_user.h5'
	params['log_dqn_path'] = 'RL/algorithms/DQN/logs/scores_' + str(datetime.datetime.now().strftime("%Y%m%d%H%M%S")) + '.txt'
	params['weights_par_name'] = True		# Name weights with parameters structure

	return params