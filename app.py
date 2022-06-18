from RL.algorithms.DrawArchitecture.drawTree import *
from RL.algorithms.DQN.DQN_algorithm import *
import RL.algorithms.DQN.DQN_algorithm
from RL.environment.parametrs import *
from flask import Flask, render_template, request

app = Flask(__name__,template_folder='template')
app.config['SECRET_KEY'] = 'secretkey'
socketio = SocketIO(app)

@app.route('/')
@app.route('/index.html')
def index():
	return render_template('index.html')

@app.route('/layersPic', methods=['POST'])
def layersPic():
	if request.method == 'POST':
		output = request.get_json()
		pic_id = output[1]['pic_id']
		drawTree(output[0]['arr_layers'],pic_id)
		return ("",204)

@socketio.on('message')
def handle_message(message):
	print("Message recieved: "+message)
	if message=="Stop game.":
		RL.algorithms.DQN.DQN_algorithm.stop_game_from_client = True
	if message == "Stop game. No plot.":
		RL.algorithms.DQN.DQN_algorithm.stop_game_from_client = True
		RL.algorithms.DQN.DQN_algorithm.no_plot_from_client = True

@app.route('/startLearning', methods=['POST'])
def startLearning():
	if request.method == 'POST':
		output = request.get_json()
		params = define_parameters()
		params['epsilon_decay_linear'] = eval(output[0]["epsilon_decay_linear"])
		params['learning_rate'] = eval(output[1]["learning_rate"])
		params['memory_size'] = int(output[2]["memory_size"])
		params['batch_size'] = int(output[3]["batch_size"])
		params['episodes'] = int(output[4]["games_amount"])
		params['speed'] = int(output[5]["speed1"])
		params['layer_size'] = list(map(int, output[6]["layers"]))
		params['load_weights'] = False
		params['train'] = True			# Train mode
		params['test'] = False			# Game mode
		params['plot_score'] = True 	# Make result plot after train/game
		params['displayPY'] = False		# Use Pygame interface
		if params['speed']==0:
			params['displayJS'] = False	# Use JS interface (display only stats)
		else:
			params['displayJS'] = True	# Use JS interface (display game + stats)
		print(params)
		DQN_run(display = params['displayPY'], speed = params['speed'], train = params['train'],params=params, socketio=socketio)
		return ("",204)

@app.route('/startGaming', methods=['POST'])
def startGaming():
	if request.method == 'POST':
		output = request.get_json()
		params = define_parameters()
		params['epsilon_decay_linear'] = eval(output[0]["epsilon_decay_linear"])
		params['learning_rate'] = eval(output[1]["learning_rate"])
		params['memory_size'] = int(output[2]["memory_size"])
		params['batch_size'] = int(output[3]["batch_size"])
		params['episodes'] = int(output[4]["games_amount"])
		params['speed'] = int(output[5]["speed1"])
		params['layer_size'] = list(map(int, output[6]["layers"]))
		params['weights_name'] = output[7]["weight_path"]
		params['load_weights'] = True
		params['train'] = False			# Train mode
		params['test'] = True			# Game mode
		params['plot_score'] = True 	# Make result plot after train/game
		params['displayPY'] = False		# Use Pygame interface
		if params['speed']==0:
			params['displayJS'] = False	# Use JS interface (display only stats)
		else:
			params['displayJS'] = True	# Use JS interface (display game + stats)
		print(params)
		DQN_run(display = params['displayPY'], speed = params['speed'], train = params['train'],params=params, socketio=socketio)
		return ("",204)

if __name__ == "__main__":
	socketio.run(app, debug=True)