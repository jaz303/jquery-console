task :default do
  `cat jquery-console.js | ./make-bookmarklet.pl > out.html`
end

# mac only i think
task :open => :default do
  `open out.html`
end