import sys

# Retrieve the command line arguments passed from Node.js
# The first argument (sys.argv[0]) is the script name, so start from the second argument
value1_from_node = sys.argv[1] if len(sys.argv) > 1 else None
value2_from_node = sys.argv[2] if len(sys.argv) > 2 else None

if value1_from_node and value2_from_node:
    print(f'Values received from Node.js: {value1_from_node}, {value2_from_node}')
else:
    print('Not enough values received from Node.js')
