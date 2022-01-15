# pip3 install pandas
# pip3 install numpy
# pip3 install sklearn

# Exploratory Data Analysis (EDA) packages
import pandas as pd
import numpy as np
import joblib
import pickle

# Scikit-learn packages
# Naive Bayes algorithm for Classification
from sklearn.naive_bayes import MultinomialNB 
from sklearn.feature_extraction.text import CountVectorizer 
from sklearn.model_selection import train_test_split 
from sklearn.metrics import accuracy_score 

df = pd.read_csv("/tmp/nationality.csv")

# print(df.shape)
# print(df.head)
# print(df.columns)
# print(df['nationality'].unique())

# Checking if our data is balanced for training
# print(df.groupby('nationality')['names'].size())

# Xfeatures are individual independent variables that act as input in your system
# ylabels will be used as outputs when making predictions.
Xfeatures = df['names']
ylabels= df['nationality']
vec = CountVectorizer()
X = vec.fit_transform(Xfeatures)
vec.get_feature_names_out()

# Splitting the data
x_train,x_test,y_train,y_test = train_test_split(X,ylabels,test_size=0.30)

# Building the model & Checking the accuracy of Model
nb = MultinomialNB()
nb.fit(x_train,y_train)
print(nb.score(x_test,y_test))

# Making predictions
sample1 = ["Yin","Bathsheba","Brittany","Vladmir"]
vector1 = vec.transform(sample1).toarray()
print(nb.predict(vector1))

# Saving our model
nationality_predictor = open("/tmp/naive_bayes.pkl","wb")
joblib.dump((vec, nb),nationality_predictor)
nationality_predictor.close()
