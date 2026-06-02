import json
import re

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

categories = ['aiServices', 'itServices', 'cloudServices', 'securityServices', 'dataServices', 'automationServices']

all_services = []

for cat in categories:
    # Find the pattern: export const cat: Service[] = [ ... ];
    pattern = rf'export const {cat}: Service\[\] = $$(.*?)$$;'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        array_str = match.group(1)
        # Replace single quotes with double quotes
        array_str = array_str.replace(/'/g, '"')
        # Remove trailing commas
        array_str = re.sub(r',\s*}', '}', array_str)
        array_str = re.sub(r',\s*]', ']', array_str)
        # Ensure property names are quoted (if they aren't already)
        array_str = re.sub(r'([{,])\s*(\w+)\s*:', r'\1 "\2":', array_str)
        # Now try to parse as JSON
        try:
            services = json.loads(array_str)
            all_services.extend(services)
        except json.JSONDecodeError as e:
            print(f"Error parsing {cat}: {e}")
            print(f"Array string: {array_str[:200]}")
    else:
        print(f"Could not find {cat}")

# Write the all_services array to servicesData.json
with open('app/data/servicesData.json', 'w') as f:
    json.dump(all_services, f, indent=2)

print("Successfully regenerated servicesData.json")
