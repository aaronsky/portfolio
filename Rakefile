require 'optparse'
require 'rake/testtask'

task :default => [:rebuild]
task :rebuild => [:clean, :build]
task :watch => [:clean, :serve]

task :clean do
  sh 'rm -rf _site .sass-cache tmp'
end

task :build do
  sh 'bundle exec jekyll build'
end

task :serve do
  sh 'bundle exec jekyll serve'
end

task :test do
  ruby "tests/test_helper.rb"
end