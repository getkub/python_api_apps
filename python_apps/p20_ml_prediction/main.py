
import joblib
from sklearn.naive_bayes import MultinomialNB 
from sklearn.feature_extraction.text import CountVectorizer 
from sklearn.model_selection import train_test_split 
from sklearn.metrics import accuracy_score

class p20_ml():

    def __init__(self):
        super()

    def predict_nationality(self, model_file):
        nb = MultinomialNB()
        model_file="/tmp/naive_bayes.pkl"
        in_model_file = open(model_file,"rb")
        nb = joblib.load(in_model_file)
        # vect = nb.transform(data).toarray()
        # result = nb.predict(vect)
        return "hello"

if __name__ == "__main__":
    p20_ml.run()

