import json
from collections import defaultdict

def run_me_1(sample_input):
    d = defaultdict(lambda: "NA")
    d['sample_input'] = sample_input
    # json_data = json.dumps(d, indent=2)
    return d
