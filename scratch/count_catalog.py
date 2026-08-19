import re

def count_products(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    names = re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', text)
    return names

prod_names = count_products('src/data/products.ts')
seed_names = count_products('src/data/seed/seedData.ts')

print(f"Products in src/data/products.ts ({len(prod_names)} items):")
for i, n in enumerate(prod_names, 1):
    print(f"  {i}. {n}")

print(f"\nProducts in src/data/seed/seedData.ts ({len(seed_names)} items):")
for i, n in enumerate(seed_names, 1):
    print(f"  {i}. {n}")
