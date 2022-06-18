import random
import numpy as np
import pandas as pd
import collections
import torch
import torch.nn as nn
import torch.nn.functional as F
DEVICE = 'cpu'


class DQNAgent(torch.nn.Module):
	def __init__(self, params):
		super().__init__()
		self.reward = 0
		self.gamma = 0.9
		self.dataframe = pd.DataFrame()
		self.short_memory = np.array([])
		self.agent_target = 1
		self.agent_predict = 0
		self.learning_rate = params['learning_rate']
		self.epsilon = 1
		self.actual = []
		self.layers = params['layer_size']
		self.memory = collections.deque(maxlen=params['memory_size'])
		self.weights = params['weights_name']
		self.load_weights = params['load_weights']
		self.optimizer = None
		print(params)
		self.network()

	def network(self):
		# Layers

		if len(self.layers) == 1:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], 3)
		elif len(self.layers) == 2:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], 3)
		elif len(self.layers) == 3:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], 3)
		elif len(self.layers) == 4:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], 3)
		elif len(self.layers) == 5:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], 3)
		elif len(self.layers) == 6:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], self.layers[5])
			self.f7 = nn.Linear(self.layers[5], 3)
		elif len(self.layers) == 7:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], self.layers[5])
			self.f7 = nn.Linear(self.layers[5], self.layers[6])
			self.f8 = nn.Linear(self.layers[6], 3)
		elif len(self.layers) == 8:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], self.layers[5])
			self.f7 = nn.Linear(self.layers[5], self.layers[6])
			self.f8 = nn.Linear(self.layers[6], self.layers[7])
			self.f9 = nn.Linear(self.layers[7], 3)
		elif len(self.layers )== 9:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], self.layers[5])
			self.f7 = nn.Linear(self.layers[5], self.layers[6])
			self.f8 = nn.Linear(self.layers[6], self.layers[7])
			self.f9 = nn.Linear(self.layers[7], self.layers[8])
			self.f10 = nn.Linear(self.layers[8], 3)
		elif len(self.layers) == 10:
			self.f1 = nn.Linear(11, self.layers[0])
			self.f2 = nn.Linear(self.layers[0], self.layers[1])
			self.f3 = nn.Linear(self.layers[1], self.layers[2])
			self.f4 = nn.Linear(self.layers[2], self.layers[3])
			self.f5 = nn.Linear(self.layers[3], self.layers[4])
			self.f6 = nn.Linear(self.layers[4], self.layers[5])
			self.f7 = nn.Linear(self.layers[5], self.layers[6])
			self.f8 = nn.Linear(self.layers[6], self.layers[7])
			self.f9 = nn.Linear(self.layers[7], self.layers[8])
			self.f10 = nn.Linear(self.layers[8], self.layers[9])
			self.f11 = nn.Linear(self.layers[9], 3)

		# weights
		if self.load_weights:
			print("weights: "+self.weights)
			self.model = self.load_state_dict(torch.load(self.weights))
			print("weights loaded")

	def forward(self, x):
		if len(self.layers) == 1:
			x = F.relu(self.f1(x))
			x = F.softmax(self.f2(x), dim=-1)
			return x
		elif len(self.layers) == 2:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.softmax(self.f3(x), dim=-1)
			return x
		elif len(self.layers) == 3:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.softmax(self.f4(x), dim=-1)
			return x
		elif len(self.layers) == 4:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.softmax(self.f5(x), dim=-1)
			return x
		elif len(self.layers) == 5:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.softmax(self.f6(x), dim=-1)
			return x
		elif len(self.layers) == 6:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.relu(self.f6(x))
			x = F.softmax(self.f7(x), dim=-1)
			return x
		elif len(self.layers) == 7:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.relu(self.f6(x))
			x = F.relu(self.f7(x))
			x = F.softmax(self.f8(x), dim=-1)
			return x
		elif len(self.layers) == 8:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.relu(self.f6(x))
			x = F.relu(self.f7(x))
			x = F.relu(self.f8(x))
			x = F.softmax(self.f9(x), dim=-1)
			return x
		elif len(self.layers) == 9:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.relu(self.f6(x))
			x = F.relu(self.f7(x))
			x = F.relu(self.f8(x))
			x = F.relu(self.f9(x))
			x = F.softmax(self.f10(x), dim=-1)
			return x
		elif len(self.layers) == 10:
			x = F.relu(self.f1(x))
			x = F.relu(self.f2(x))
			x = F.relu(self.f3(x))
			x = F.relu(self.f4(x))
			x = F.relu(self.f5(x))
			x = F.relu(self.f6(x))
			x = F.relu(self.f7(x))
			x = F.relu(self.f8(x))
			x = F.relu(self.f9(x))
			x = F.relu(self.f10(x))
			x = F.softmax(self.f11(x), dim=-1)
			return x

	def set_reward(self, player, crash):
		self.reward = 0
		if crash:
			self.reward = -10
			return self.reward
		if player.eaten:
			self.reward = 10
		return self.reward

	def remember(self, state, action, reward, next_state, done):
		self.memory.append((state, action, reward, next_state, done))

	def replay_new(self, memory, batch_size):
		if len(memory) > batch_size:
			minibatch = random.sample(memory, batch_size)
		else:
			minibatch = memory
		for state, action, reward, next_state, done in minibatch:
			self.train()
			torch.set_grad_enabled(True)
			target = reward
			next_state_tensor = torch.tensor(np.expand_dims(next_state, 0), dtype=torch.float32).to(DEVICE)
			state_tensor = torch.tensor(np.expand_dims(state, 0), dtype=torch.float32, requires_grad=True).to(DEVICE)
			output = self.forward(state_tensor)
			if not done:
				target = reward + self.gamma * torch.max(self.forward(next_state_tensor)[0])
			target_f = output.clone()
			target_f[0][np.argmax(action)] = target
			target_f.detach()
			self.optimizer.zero_grad()
			loss = F.mse_loss(output, target_f)
			loss.backward()
			self.optimizer.step()

	def train_short_memory(self, state, action, reward, next_state, done):
		self.train()
		torch.set_grad_enabled(True)
		target = reward
		next_state_tensor = torch.tensor(next_state.reshape((1, 11)), dtype=torch.float32).to(DEVICE)
		state_tensor = torch.tensor(state.reshape((1, 11)), dtype=torch.float32, requires_grad=True).to(DEVICE)
		if not done:
			target = reward + self.gamma * torch.max(self.forward(next_state_tensor[0]))
		output = self.forward(state_tensor)
		target_f = output.clone()
		target_f[0][np.argmax(action)] = target
		target_f.detach()
		self.optimizer.zero_grad()
		loss = F.mse_loss(output, target_f)
		loss.backward()
		self.optimizer.step()
