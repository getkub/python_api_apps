
import joblib
import numpy

class p20_ml():

    def __init__(self):
        super()

    def predict_nationality(self, sample_data, model_file):
        with open(model_file,"rb") as fin:
            vec, nb = joblib.load(fin)
        # sample_data = ["Yin","Bathsheba","Brittany","Lee"]
        sample_data = numpy.array(sample_data)
        # vector1 = vec.transform(sample_data).toarray()
        # sample_data = sample_data.reshape(-1, 1)
        X_new = vec.transform(sample_data)
        X_new_preds = nb.predict(X_new)
        result = "{}".format(X_new_preds)
        return result


if __name__ == "__main__":
    p20_ml.run()

