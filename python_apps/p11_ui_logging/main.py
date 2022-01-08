
class p11_ui_logging():

    def __init__(self):
        super()
        
    def app_00(self, app_selector):
        return "MAIN_PAGE"

    def app_01(self, app_selector):
        from python_apps.p11_ui_logging.src.app_01 import run_me_1
        return (run_me_1("app_01_value"))

    def run_distributor(self, app_selector, function_to_execute):

        switcher = {
            "app_00_fn" : self.app_00,
        }
        func = switcher.get(function_to_execute, lambda: "Invalid function_to_execute")
        return func(app_selector)


if __name__ == "__main__":
    p11_ui_logging.run()
