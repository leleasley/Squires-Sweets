#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

data = YAML.load_file('_data/products.yml')
products = data['products'] || {}
Dir.mkdir('products') unless Dir.exist?('products')

products.each do |slug, info|
  title = info['name']
  desc = info['description'] || ''
  content = <<~YAML
  ---
  layout: product
  title: "#{title}"
  product: #{slug}
  description: "#{desc}"
  og_image: /image/mix1.png
  ---
  YAML

  File.write(File.join('products', "#{slug}.html"), content)
  puts "Wrote products/#{slug}.html"
end
