import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import statistics
import os

def plot_seaborn(array_counter, array_score, train, xl = 'номер игры', yl = 'набранные очки'):
    sns.set(color_codes=True, font_scale=1.5)
    sns.set_style("white")
    plt.figure(figsize=(13,8))
    fit_reg = False if train== False else True
    ax = sns.regplot(
        np.array([array_counter])[0],
        np.array([array_score])[0],
        #color="#36688D",
        x_jitter=.1,
        scatter_kws={"color": "#36688D"},
        label='Data',
        fit_reg = fit_reg,
        line_kws={"color": "#F49F05"}
    )
    # Plot the average line
    y_mean = [np.mean(array_score)]*len(array_counter)
    ax.plot(array_counter,y_mean, label='Mean', linestyle='--')
    ax.legend(loc='upper right')
    ax.set(xlabel=xl, ylabel=yl)
    #plt.show()
    dirname = os.path.dirname(__file__)
    if train== False:
        filename = os.path.join(dirname, '../../static/plots/plot1.png')
    else:
        filename = os.path.join(dirname, '../../static/plots/plot0.png')
    plt.savefig(filename)

def get_mean_stdev(array):
    return statistics.mean(array), statistics.stdev(array)