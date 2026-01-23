#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

data = YAML.load_file('_data/products.yml')
products = data['products'] || {}
Dir.mkdir('products') unless Dir.exist?('products')

products.each do |slug, info|
  title = info['name']
  desc = info['description'] || ''
  og = info['og_image'] || '/image/mix1.png'
  price = info['price'] || ''
  content = <<~YAML
  ---
  layout: product
  title: "#{title}"
  product: #{slug}
  description: "#{desc}"
  og_image: #{og}
  price: "#{price}"
  ---
  YAML

  File.write(File.join('products', "#{slug}.html"), content)
  puts "Wrote products/#{slug}.html"
end
