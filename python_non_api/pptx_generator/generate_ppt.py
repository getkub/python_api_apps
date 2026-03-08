import yaml
import os
from pptx import Presentation

INPUT_FOLDER = "pptx"
OUTPUT_FOLDER = "output"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def generate_ppt(yaml_file):

    with open(yaml_file, "r") as f:
        config = yaml.safe_load(f)

    prs = Presentation()

    for slide_data in config["slides"]:
        slide_layout = prs.slide_layouts[1]
        slide = prs.slides.add_slide(slide_layout)

        slide.shapes.title.text = slide_data["title"]

        content = "\n".join(slide_data["content"])
        slide.placeholders[1].text = content

    output_file = os.path.join(OUTPUT_FOLDER, config["output"])
    prs.save(output_file)

    print(f"Generated: {output_file}")


def main():
    for file in os.listdir(INPUT_FOLDER):
        if file.endswith(".yml") or file.endswith(".yaml"):
            generate_ppt(os.path.join(INPUT_FOLDER, file))


if __name__ == "__main__":
    main()