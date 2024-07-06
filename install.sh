#!/usr/bin/env bash

# check if python3  is installed
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Please install it first."
    exit 1
fi

# check if node is installed
if ! command -v node &> /dev/null
then
    echo "node is not installed. Please install it first."
    exit 1
fi

# check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install it first."
    exit 1
fi

# check if pip3 is installed
if ! command -v pip3 &> /dev/null
then
    echo "Pip3 is not installed. Please install it first."
    exit 1
fi


# check if pipx is installed
if ! command -v pipx &> /dev/null
then
    # if OS is macOS, use brew to install pipx
    if [ "$(uname)" == "Darwin" ]; then
        echo "Pipx is not installed. Installing it using brew..."
        brew install pipx
    else
        echo "Pipx is not installed. Please install it first. Installation instructions: https://pipx.pypa.io/stable/installation/"
        exit 1
    fi
fi

echo "Installing Devon backend..."
pipx install --force devon_agent 

if ! command -v devon_agent --help &> /dev/null
then
    echo "Devon Backend is not installed. Please install it manually by running 'pipx install --force devon_agent'"
    exit 1
fi

echo "Devon Backend is installed successfully."

echo "Installing Devon TUI..."

# Check if devon-tui npm package exists
if npm list -g devon-tui@latest &> /dev/null
then
    echo "devon-tui package is already installed."
    npm uninstall -g devon-tui
    echo "devon-tui package is uninstalled."
else
    echo "devon-tui package is not installed. Installing now..."
fi

npm install -g devon-tui@latest 
# check if devon-tui is installed
if ! command -v devon-tui &> /dev/null
then
    echo "Devon TUI is not installed. Please install it manually by running 'npm install -g devon-tui' or 'sudo npm install -g devon-tui'."
    exit 1
fi

if npm list -g devon-ui@latest &> /dev/null
then
    echo "Devon UI is already installed. Uninstalling it..."
    npm uninstall -g devon-ui
    echo "Devon UI is uninstalled."
fi

echo "Installing Devon UI..."
npm install -g devon-ui@latest
if ! command -v devon-ui &> /dev/null
then
    echo "Devon UI is not installed. Please install it manually by running 'npm install -g devon-ui' or 'sudo npm install -g devon-ui'."
    exit 1
fi


echo "Devon TUI is installed successfully."
echo "Devon is installed successfully."
echo "Run 'devon-tui' to start the Devon TUI."
echo "Run 'devon-ui' to start the Devon UI."