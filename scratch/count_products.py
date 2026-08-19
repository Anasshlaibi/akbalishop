import re

with open('src/data/seedData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

names = re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', text)
print(f"Total Seed Products Count: {len(names)}")
print("\nList of Products in Catalog:")
for i, name in enumerate(names, 1):
    print(f"  {i}. {name}")
