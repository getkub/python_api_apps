
class p03_distributor():

    def __init__(self):
        super()
        
    def app_00(self, app_selector):
        return "MAIN_PAGE"

    def app_01(self, app_selector):
        from python_apps.p03_distributor.src.app_01 import run_me_1
        return (run_me_1("app_01_value"))

    def app_02(self, app_selector): 
        from python_apps.p03_distributor.src.app_01 import run_me_1
        return (run_me_1("app_02_value"))

    def run_distributor(self, app_selector, function_to_execute):

        switcher = {
            "app_00_fn" : self.app_00,
            "app_01_fn" : self.app_01,
            "app_02_fn" : self.app_02,
        }
        func = switcher.get(function_to_execute, lambda: "Invalid function_to_execute")
        return func(app_selector)


if __name__ == "__main__":
    p03_distributor.run()
