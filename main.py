import os
import shlex
import re

# Configuration
OUTPUT_FILE = "project_context.md"

def process_file(file_path, outfile):
    try:
        ext = os.path.splitext(file_path)[1]

        # Optional: skip binary / unwanted files
        if ext.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.exe', '.zip']:
            return

        with open(file_path, 'r', encoding='utf-8') as infile:
            content = infile.read()

        try:
            display_path = os.path.relpath(file_path, os.getcwd())
        except ValueError:
            display_path = file_path

        outfile.write(f"## File: {display_path}\n")
        outfile.write(f"```{ext[1:] if ext else ''}\n")
        outfile.write(content)
        outfile.write("\n```\n\n")
        outfile.write("---\n\n")

        print(f"✔ Added: {display_path}")

    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")


def generate_markdown():
    print("---------------------------------------------------------")
    print("DRAG & DROP MODE")
    print("Drag files or folders here and press ENTER.")
    print("---------------------------------------------------------")

    try:
        user_input = input("> ").strip()
    except EOFError:
        return

    if not user_input:
        print("No input provided.")
        return

    # Fix drag-drop spacing issue
    sanitized_input = re.sub(r"(?<=['\"])(?=['\"])", " ", user_input)

    try:
        file_paths = shlex.split(sanitized_input)
    except ValueError:
        file_paths = sanitized_input.split()

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        print(f"\nProcessing {len(file_paths)} inputs...\n")

        files_processed = 0

        for path in file_paths:
            clean_path = path.strip('"').strip("'")

            if not clean_path:
                continue

            if os.path.exists(clean_path):

                # ✅ If it's a file
                if os.path.isfile(clean_path):
                    process_file(clean_path, outfile)
                    files_processed += 1

                # ✅ If it's a folder
                elif os.path.isdir(clean_path):
                    for root, dirs, files in os.walk(clean_path):

                        # Optional: skip heavy folders
                        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__']]

                        for file in files:
                            file_path = os.path.join(root, file)
                            process_file(file_path, outfile)
                            files_processed += 1

            else:
                print(f"⚠ Not Found: {clean_path}")

    print(f"\nDone! {files_processed} files saved to {OUTPUT_FILE}")

    # Auto open in VS Code (optional)
    if files_processed > 0:
        print("Opening in VS Code...")
        os.system(f"code {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_markdown()

