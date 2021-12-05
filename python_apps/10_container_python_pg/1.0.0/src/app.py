import socket
import asyncio
import time
import random
import json

from walkoff_app_sdk.app_base import AppBase

class PythonPlayground(AppBase):
    __version__ = "1.0.0"
    app_name = "python_playground"  # this needs to match "name" in api.yaml

    def __init__(self, redis, logger, console_logger=None):
        """
        Each app should have this __init__ to set up Redis and logging.
        :param redis:
        :param logger:
        :param console_logger:
        """
        super().__init__(redis, logger, console_logger)

    def run_me_1(self, json_data): 
        return "Ran email_parser"

    def run_me_2(self, json_data): 
        return "Ran ansible_caller"

    # Write your data inside this function
    def run_python_script(self, json_data, function_to_execute):
        # It comes in as a string, so needs to be set to JSON
        try:
            json_data = json.loads(json_data)
        except json.decoder.JSONDecodeError as e:
            return "Couldn't decode json: %s" % e

        # These are functions
        switcher = {
            "email_parser" : self.run_me_1,
            "ansible_caller" : self.run_me_2,
        }

        func = switcher.get(function_to_execute, lambda: "Invalid function")
        return func(json_data)

if __name__ == "__main__":
    PythonPlayground.run()
