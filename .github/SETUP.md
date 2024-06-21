###SETTING UP AZURE PERMISSIONS
### RUN THE FOLLOWING COMMANDS IN A BASH TERMINAL
# Generate SSH Key Pair: 
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Add SSH Key to Azure DevOps:
cat ~/.ssh/id_rsa.pub (This shows you your public key)
Go to Azure DevOps and navigate to Your Profile > Security > SSH Public Keys.
Click on Add and paste the public key, then save.

# Set Up SSH Config:
nano ~/.ssh/config
Add the following configuration:
Host azure
    HostName ssh.dev.azure.com
    User git
    IdentityFile ~/.ssh/id_rsa
(Don't change anything)

Ensure config has correct permission by running:
chmod 600 ~/.ssh/config

# Add SSH Key to SSH Agent:
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# Clone the Repository:
git clone azure:v3/your_organization/your_project/your_repo

# Update Remote URL in Existing Repository:
git remote set-url origin azure:v3/your_organization/your_project/your_repo
(Paste the link from the project homepage) --> Clone -> SSH -> Copy Link




