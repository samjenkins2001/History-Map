# Use the official VS Code dev container as a base
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bullseye

# Install zsh and curl
RUN apt-get update && apt-get install -y zsh curl

# Install nvm
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"' >> /root/.zshrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm' >> /root/.zshrc

# Set the default shell to zsh
SHELL ["/bin/zsh", "-c"]

# Install Python dependencies
COPY requirements.txt /tmp/pip-tmp/
RUN pip install --no-cache-dir -r /tmp/pip-tmp/requirements.txt && rm -rf /tmp/pip-tmp

# Set the work directory
WORKDIR /workspace



