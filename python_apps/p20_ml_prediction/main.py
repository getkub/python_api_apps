
import joblib
import numpy as np

class p20_ml():

    def __init__(self):
        super()

    def predict_nationality(self, model_file):
        model_file="/tmp/naive_bayes.pkl"
        nationality_predictor = open(model_file,"rb")
        vec = joblib.load(nationality_predictor)
        nationality_predictor.close()
        sample1 = ["Yin","Bathsheba","Brittany","Vladmir"]
        sample1 = [1, 2, 3, 4]
        sample1 = ["Yin","Bathsheba","Brittany","Vladmir"]
        my_array = np.array(sample1)
        # ts = my_array.tostring()
        # temp = sample1.reshape(len(sample1), 1)
        # vector1 = vec.transform(sample1).toarray()
        my_array = my_array.reshape(-1, 1)
        result = vec.predict(my_array)
        return result


if __name__ == "__main__":
    p20_ml.run()

