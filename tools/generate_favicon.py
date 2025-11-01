from PIL import Image

def generate_favicons(input_path, output_dir):
    sizes = [(32, 32), (16, 16)]
    
    # Open the input image
    with Image.open(input_path) as img:
        for size in sizes:
            output_path = f"{output_dir}/logo-{size[0]}.png"
            img.resize(size, Image.Resampling.LANCZOS).save(output_path)
            print(f"Generated: {output_path}")

        # Generate favicon.ico
        ico_path = f"{output_dir}/favicon.ico"
        img.save(ico_path, format='ICO', sizes=[(32, 32), (16, 16)])
        print(f"Generated: {ico_path}")

if __name__ == "__main__":
    import os

    input_logo = "static/logo.png"
    output_directory = "static"

    if not os.path.exists(input_logo):
        print(f"Input logo not found: {input_logo}")
    else:
        generate_favicons(input_logo, output_directory)