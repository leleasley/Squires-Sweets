#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'
path = '_data/products.yml'
data = YAML.load_file(path)
changed = false
products = data['products'] || {}
products.each do |slug, info|
  unless info.key?('price')
    info['price'] = ''
    changed = true
  end
  unless info.key?('og_image')
    info['og_image'] = '/image/mix1.png'
    changed = true
  end
end
if changed
  File.write(path, data.to_yaml)
  puts 'Updated products with default price and og_image where missing.'
else
  puts 'No changes needed.'
end
