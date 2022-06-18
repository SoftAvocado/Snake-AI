from matplotlib import pyplot
from math import cos, sin, atan
from os import walk

class Neuron():
	def __init__(self, x, y):
		self.x = x
		self.y = y

	def draw(self, neuron_radius):
		circle = pyplot.Circle((self.x, self.y), radius=neuron_radius, fill=False)
		pyplot.gca().add_patch(circle)


class Layer():
	def __init__(self, network, number_of_neurons, actual_number_of_neurons, number_of_neurons_in_widest_layer):
		self.vertical_distance_between_layers = 6
		self.horizontal_distance_between_neurons = 1.5
		self.neuron_radius = 0.5
		self.number_of_neurons_in_widest_layer = number_of_neurons_in_widest_layer
		self.previous_layer = self.__get_previous_layer(network)
		self.y = self.__calculate_layer_y_position()
		self.neurons = self.__intialise_neurons(number_of_neurons)
		self.actual_neurons = self.__intialise_neurons(actual_number_of_neurons)

	def __intialise_neurons(self, number_of_neurons):
		neurons = []
		x = self.__calculate_left_margin_so_layer_is_centered(number_of_neurons)
		for iteration in range(number_of_neurons):
			neuron = Neuron(x, self.y)
			neurons.append(neuron)
			x += self.horizontal_distance_between_neurons
		return neurons

	def __calculate_left_margin_so_layer_is_centered(self, number_of_neurons):
		return self.horizontal_distance_between_neurons * (
				self.number_of_neurons_in_widest_layer - number_of_neurons) / 2

	def __calculate_layer_y_position(self):
		if self.previous_layer:
			return self.previous_layer.y + self.vertical_distance_between_layers
		else:
			return 0

	def __get_previous_layer(self, network):
		if len(network.layers) > 0:
			return network.layers[-1]
		else:
			return None

	def __line_between_two_neurons(self, neuron1, neuron2):
		angle = atan((neuron2.x - neuron1.x) / float(neuron2.y - neuron1.y))
		x_adjustment = self.neuron_radius * sin(angle)
		y_adjustment = self.neuron_radius * cos(angle)
		line = pyplot.Line2D((neuron1.x - x_adjustment, neuron2.x + x_adjustment),
		                     (neuron1.y - y_adjustment, neuron2.y + y_adjustment), linewidth=0.5, color="seagreen",
		                     alpha=0.4)
		pyplot.gca().add_line(line)

	def get_super(self, xx):
		normal = "0123456789"
		super_s = "⁰¹²³⁴⁵⁶⁷⁸⁹"
		res = xx.maketrans(''.join(normal), ''.join(super_s))
		return xx.translate(res)

	def draw(self, layerType=0):
		for neuron in self.neurons:
			neuron.draw(self.neuron_radius)
			if self.previous_layer:
				for previous_layer_neuron in self.previous_layer.neurons:
					self.__line_between_two_neurons(neuron, previous_layer_neuron)
		# write Text
		x_text = self.number_of_neurons_in_widest_layer * self.horizontal_distance_between_neurons
		if layerType == 0:
			pyplot.text(x_text, self.y, "Output\n    R" + self.get_super(str(len(self.actual_neurons))), fontsize=12)
		elif layerType == -1:
			pyplot.text(x_text, self.y, "Input\n   R" + self.get_super(str(len(self.actual_neurons))), fontsize=12)
			
		else:
			pyplot.text(x_text, self.y, 'Hidden\n    R' + self.get_super(str(len(self.actual_neurons))), fontsize=12)


class NeuralNetwork():
	def __init__(self, number_of_neurons_in_widest_layer):
		self.number_of_neurons_in_widest_layer = number_of_neurons_in_widest_layer
		self.layers = []
		self.layertype = 0

	def add_layer(self, number_of_neurons, actual_number_of_neurons):
		layer = Layer(self, number_of_neurons, actual_number_of_neurons, self.number_of_neurons_in_widest_layer)
		self.layers.append(layer)

	def draw(self):
		pyplot.figure()
		for i in range(len(self.layers)):
			layer = self.layers[i]
			if i == len(self.layers) - 1:
				i = -1
			layer.draw(i)
		pyplot.axis('scaled')
		pyplot.axis('off')
		pyplot.show()

	def save1(self, pic_id):
		pyplot.figure()
		for i in range(len(self.layers)):
			layer = self.layers[i]
			if i == len(self.layers) - 1:
				i = -1
			layer.draw(i)
		pyplot.axis('scaled')
		pyplot.axis('off')

		file = 'static/layer_pictures/'+str(pic_id)+'.png'
		pyplot.savefig(file)
		print('Picture saved: '+file)

	def save2(self):
		pyplot.figure()
		for i in range(len(self.layers)):
			layer = self.layers[i]
			if i == len(self.layers) - 1:
				i = -1
			layer.draw(i)
		pyplot.axis('scaled')
		pyplot.axis('off')

		filenames = next(walk('static/layer_pictures/'), (None, None, []))[2]
		if filenames==[]:
			newid = '0'
		else:
			filenums = [int(f[:-4]) for f in filenames]
			filenums.sort()
			#print(filenums)
			oldid = filenums[-1]
			newid = str(oldid+1)
		file = 'static/layer_pictures/'+newid+'.png'

		pyplot.savefig(file)
		print('Picture saved: '+file)


class DrawNN():
	def __init__(self, neural_network):
		self.neural_network = neural_network
		self.shaped_neural_network = self.reshape()

	def reshape(self):
		shaped_neural_network = self.neural_network[:]
		for i in range(len(shaped_neural_network)):
			x=shaped_neural_network[i]
			if shaped_neural_network[i] > 11:
				x = 12
			if shaped_neural_network[i] >= 50:
				x = 14
			if shaped_neural_network[i] >= 100:
				x = 18
			if shaped_neural_network[i] >= 150:
				x = 20
			if shaped_neural_network[i] >= 200:
				x = 22
			if shaped_neural_network[i] >= 250:
				x = 23
			if shaped_neural_network[i] >= 300:
				x = 24
			shaped_neural_network[i] = x
		#print(shaped_neural_network)
		return shaped_neural_network

	def draw(self):
		widest_layer = max(self.shaped_neural_network)
		network = NeuralNetwork(widest_layer)
		for i in range(len(self.shaped_neural_network)):
			network.add_layer(self.shaped_neural_network[i],self.neural_network[i])
		network.draw()

	def save(self, pic_id):
		widest_layer = max(self.shaped_neural_network)
		network = NeuralNetwork(widest_layer)
		for i in range(len(self.shaped_neural_network)):
			network.add_layer(self.shaped_neural_network[i],self.neural_network[i])
		network.save1(pic_id)     # save1 for generating single picture as static/layer_pictures/0.png
							# save2 for also saving old pictures

def drawTree(hidden_layers_n,pic_id):
	hidden_layers_n = list(reversed(list(map(int, hidden_layers_n))))
	input_n = 11
	output_n = 3
	#hidden_layers_n = [100, 50, 100]
	DrawNN([output_n, *hidden_layers_n, input_n]).save(pic_id)
