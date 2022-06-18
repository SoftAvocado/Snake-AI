import pygame
from random import randint
import numpy as np
from operator import add

path_log_games = 'RL/environment/logs/log_games.txt'
log = open(path_log_games, 'w+')
cell = 20
pre_path = "RL/environment/img/"

class Game:
    def __init__(self, game_width, game_height):
        pygame.display.set_caption('Snake AI')
        self.game_width = game_width
        self.game_height = game_height
        self.gameDisplay = pygame.display.set_mode((game_width, game_height + 60))

        self.bg = pygame.image.load(pre_path+"background.png")
        self.crash = False
        self.player = Player(self)
        self.food = Food()
        self.score = 0

class Player(object):
    def __init__(self, game):
        x = 0.45 * game.game_width
        y = 0.5 * game.game_height
        self.x = int(x - x % cell)
        self.y = int(y - y % cell)
        self.position = []
        self.position.append([self.x, self.y])
        self.food = 1
        self.eaten = False
        self.image = pygame.image.load(pre_path+'snakeBody.png')
        self.head_bg = pygame.image.load(pre_path+"snakeHead.png")
        self.x_change = cell
        self.y_change = 0

    def update_position(self, x, y):
        if self.position[-1][0] != x or self.position[-1][1] != y:
            if self.food > 1:
                for i in range(0, self.food - 1):
                    self.position[i][0], self.position[i][1] = self.position[i + 1]
            self.position[-1][0] = x
            self.position[-1][1] = y

    def do_move(self, move, x, y, game, food):
        move_array = [self.x_change, self.y_change]

        if self.eaten:
            self.position.append([self.x, self.y])
            self.eaten = False
            self.food = self.food + 1
        if np.array_equal(move, [1, 0, 0]):
            move_array = self.x_change, self.y_change
        elif np.array_equal(move, [0, 1, 0]) and self.y_change == 0:  # right - going horizontal
            move_array = [0, self.x_change]
        elif np.array_equal(move, [0, 1, 0]) and self.x_change == 0:  # right - going vertical
            move_array = [-self.y_change, 0]
        elif np.array_equal(move, [0, 0, 1]) and self.y_change == 0:  # left - going horizontal
            move_array = [0, -self.x_change]
        elif np.array_equal(move, [0, 0, 1]) and self.x_change == 0:  # left - going vertical
            move_array = [self.y_change, 0]
        self.x_change, self.y_change = move_array
        self.x = x + self.x_change
        self.y = y + self.y_change

        if self.x < cell or self.x > game.game_width - (cell*2) \
                or self.y < cell \
                or self.y > game.game_height - (cell*2) \
                or [self.x, self.y] in self.position:
            log.write("\n\t\t\t\t SNAKE CRASHED\n")
            log.write("self.x = " + str(self.x) + "\n")
            log.write("self.y = " + str(self.y) + "\n")
            log.write("game.game_width - (cell*2) = " + str(game.game_width - (cell*2)) + "\n")
            log.write("game.game_height - (cell*2) = " + str(game.game_height - (cell*2)) + "\n")
            log.write("self.position = " + str(self.position) + "\n\n")
            log.write("self.x < 0 : "+str(self.x < 0)+"\n")
            log.write("self.x > game.game_width - (cell*2) : " + str(self.x > game.game_width - (cell*2))+"\n")
            log.write("self.y < 0 : " + str(self.y < 0) + "\n")
            log.write("self.y > game.game_height - (cell*2) : " + str(self.y > game.game_height - (cell*2)) + "\n")
            log.write("[self.x, self.y] in self.position : " + str([self.x, self.y] in self.position) + "\n\n")

            game.crash = True
        eat(self, food, game)

        self.update_position(self.x, self.y)

    def display_player(self, x, y, food, game):
        self.position[-1][0] = x
        self.position[-1][1] = y

        if game.crash == False:
            x_temp, y_temp = self.position[-1]
            game.gameDisplay.blit(self.head_bg, (x_temp, y_temp))

            for i in range(food-1):
                x_temp, y_temp = self.position[len(self.position) - 2 - i]
                game.gameDisplay.blit(self.image, (x_temp, y_temp))

            update_screen()
        else:
            pygame.time.wait(300)

class Food(object):
    def __init__(self):
        self.x_food = 240
        self.y_food = 200
        self.image = pygame.image.load(pre_path+'food.png')

    def food_coord(self, game, player):
        log.write("Snake position: " + str(player.position) + "\n")
        x_rand = randint(cell, game.game_width - (cell*2+1))
        self.x_food = x_rand - x_rand % cell
        y_rand = randint(cell, game.game_height - (cell*2+1))
        self.y_food = y_rand - y_rand % cell
        if ([self.x_food, self.y_food] not in player.position) and ([self.x_food, self.y_food] != [player.x, player.y]):
            return self.x_food, self.y_food
        else:
            self.food_coord(game, player)

    def display_food(self, x, y, game):
        game.gameDisplay.blit(self.image, (x, y))
        update_screen()


def get_state(game, player, food):
    state = [
        (player.x_change == 20 and player.y_change == 0 and (
            (list(map(add, player.position[-1], [20, 0])) in player.position) or
            player.position[-1][0] + 20 >= (game.game_width - 20))) or (
            player.x_change == -20 and player.y_change == 0 and (
            (list(map(add, player.position[-1], [-20, 0])) in player.position) or
            player.position[-1][0] - 20 < 20)) or (player.x_change == 0 and player.y_change == -20 and (
            (list(map(add, player.position[-1], [0, -20])) in player.position) or
            player.position[-1][-1] - 20 < 20)) or (player.x_change == 0 and player.y_change == 20 and (
            (list(map(add, player.position[-1], [0, 20])) in player.position) or
            player.position[-1][-1] + 20 >= (game.game_height - 20))),  # danger straight

        (player.x_change == 0 and player.y_change == -20 and (
            (list(map(add, player.position[-1], [20, 0])) in player.position) or
            player.position[-1][0] + 20 > (game.game_width - 20))) or (
            player.x_change == 0 and player.y_change == 20 and ((list(map(add, player.position[-1],
                                                                          [-20, 0])) in player.position) or
                                                                player.position[-1][0] - 20 < 20)) or (
            player.x_change == -20 and player.y_change == 0 and ((list(map(
            add, player.position[-1], [0, -20])) in player.position) or player.position[-1][-1] - 20 < 20)) or (
            player.x_change == 20 and player.y_change == 0 and (
            (list(map(add, player.position[-1], [0, 20])) in player.position) or player.position[-1][
            -1] + 20 >= (game.game_height - 20))),  # danger right

        (player.x_change == 0 and player.y_change == 20 and (
            (list(map(add, player.position[-1], [20, 0])) in player.position) or
            player.position[-1][0] + 20 > (game.game_width - 20))) or (
            player.x_change == 0 and player.y_change == -20 and ((list(map(
            add, player.position[-1], [-20, 0])) in player.position) or player.position[-1][0] - 20 < 20)) or (
            player.x_change == 20 and player.y_change == 0 and (
            (list(map(add, player.position[-1], [0, -20])) in player.position) or player.position[-1][
            -1] - 20 < 20)) or (
            player.x_change == -20 and player.y_change == 0 and (
            (list(map(add, player.position[-1], [0, 20])) in player.position) or
            player.position[-1][-1] + 20 >= (game.game_height - 20))),  # danger left

        player.x_change == -20,  # move left
        player.x_change == 20,  # move right
        player.y_change == -20,  # move up
        player.y_change == 20,  # move down
        food.x_food < player.x,  # food left
        food.x_food > player.x,  # food right
        food.y_food < player.y,  # food up
        food.y_food > player.y  # food down
    ]

    for i in range(len(state)):
        if state[i]:
            state[i] = 1
        else:
            state[i] = 0

    return np.asarray(state)


def eat(player, food, game):
    if player.x == food.x_food and player.y == food.y_food:
        food.food_coord(game, player)
        player.eaten = True
        game.score = game.score + 1
        log.write("Snake location: (" + str(player.x) + ", " + str(player.y) + ")\n")
        log.write("\n\t\t\t\tSNAKE HAS EATEN\n")

def get_record(score, record):
    if score >= record:
        return score
    else:
        return record

def draw_grid(w, rows, game):
    blockSize = w//rows
    x=0
    y=0
    for l in range(rows-2):
        x += blockSize
        y += blockSize

        pygame.draw.line(game.gameDisplay, (200,200,200), (x, cell), (x,w-cell))
        pygame.draw.line(game.gameDisplay, (200,200,200), (cell, y), (w-cell, y))

def display_ui(game, score, record, counter_games, step):
    myfont = pygame.font.SysFont('Segoe UI', 20)
    myfont_bold = pygame.font.SysFont('Segoe UI', 20, True)
    text_game = myfont.render('GAME: ', True, (0, 0, 0))
    text_game_number = myfont.render(str(counter_games), True, (0, 0, 0))
    text_step = myfont.render('STEP: ', True, (0, 0, 0))
    text_step_number = myfont.render(str(step), True, (0, 0, 0))
    text_score = myfont.render('SCORE: ', True, (0, 0, 0))
    text_score_number = myfont.render(str(score), True, (0, 0, 0))
    text_highest = myfont.render('MAX: ', True, (0, 0, 0))
    text_highest_number = myfont_bold.render(str(record), True, (0, 0, 0))
    game.gameDisplay.blit(text_game, (10, 440))
    game.gameDisplay.blit(text_game_number, (80, 440))
    game.gameDisplay.blit(text_step, (120, 440))

    game.gameDisplay.blit(text_step_number, (180, 440))
    game.gameDisplay.blit(text_score, (230, 440))
    game.gameDisplay.blit(text_score_number, (300, 440))
    game.gameDisplay.blit(text_highest, (340, 440))
    game.gameDisplay.blit(text_highest_number, (400, 440))
    game.gameDisplay.blit(game.bg, (10, 10))
    draw_grid(440,22, game)

def display(player, food, game, record, counter_games, step):
    game.gameDisplay.fill((255, 255, 255))
    display_ui(game, game.score, record, counter_games, step)
    player.display_player(player.position[-1][0], player.position[-1][1], player.food, game)
    food.display_food(food.x_food, food.y_food, game)

def update_screen():
    pygame.display.update()



