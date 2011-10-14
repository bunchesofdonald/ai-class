(function(){

    var PriorityQueue = function() {
        var self = {};

        function __init__() {
            self.data = [];
        }

        self.empty = function() {
            return self.data.length === 0;
        }

        self.pop = function() {
            var index = 0;

            if(self.empty()) { return null; }

            for(var i = 0; i < self.data.length; i++) {
                index = self.data[i][0] < self.data[index][0] ? i : index;
            }

            return self.data.splice(index, 1)[0][1];
        }

        self.push = function(priority, datum) {
            self.data.push([priority, datum]);
        }

        self.length = function() {
            return self.data.length;
        }

        __init__();
        return self;
    }

    var Path = function(nodes) {
        var self = {};

        function __init__() {
            self.nodes = nodes || [];
        }

        self.length = function() {
            return self.nodes.length;
        }

        self.end = function() {
            return self.nodes[self.nodes.length-1];
        }

        self.to_string = function() {
            var out = [];
            for(var i = 0; i < self.nodes.length; i++) {
                out.push(self.nodes[i].name);
            }
            return out.join(" -> ")
        }

        self.draw = function(context, options) {
            for(var i = 0; i < self.nodes.length-1; i++) {
                var city_a = self.nodes[i],
                    city_b = self.nodes[i+1];

                if(!options) { options = {'line_width': 5, 'stroke_style': 'rgba(30, 144, 255, 0.6);', 'show_distance': false}; }
                map.road(city_a, city_b).draw(context, options);
            }
        }

        __init__();
        return self;
    }

    window.RouteFinder = function() {
        var self = {}; 

        self.rendering_queue = PriorityQueue();

        function __init__() {
            
            self.canvas = document.getElementById('map');
            self.context = self.canvas.getContext("2d");
            
            self.reset();
            self.update_details();

            return self;
        }

        self.update_details = function() {
            var el = document.getElementById('details');
            el.innerHTML = "<p>" + self.start_city.name + " -> " + self.goal_city.name + "<br/>" + self.start_city.distance_to(self.goal_city).toFixed(2) + "km</p>";
        }

        self.update_results = function() {
            self.running = false;
            document.getElementById('start').innerHTML = 'Start';
            var el = document.getElementById('results');
            var dist = self.start_city.distance_to(self.goal_city);
            var cost = self.cost.uniform_cost(self.winning_path).toFixed(2);
            var percent = ((cost / dist) * 100) - 100;
            percent = percent.toFixed(2);

            el.innerHTML = "<p>Distance:<br/>" + cost + "km (+" + percent + "%)</p>";
        }

        self.start = function() {
            if(self.running) { return false; }
            
            if(!self.start_city) { self.set_start(romania.cities['Arad'])}
            if(!self.goal_city) { self.set_goal(romania.cities['Bucharest'])}

            self.running = true;
            document.getElementById('start').innerHTML = 'Running...';
            self.update_details();

            self.draw_map()
            
            var cost_function = document.getElementById('cost').value;

            self.winning_path = self.get_route(romania.cities, self.cost[cost_function]);
            self.draw_queue();

        }
        
        self.reset = function() {
            self.set_start(romania.cities['Arad']);
            self.set_goal(romania.cities['Bucharest']);
            self.draw_map();
        }

        self.draw_queue = function() {
            var path = self.rendering_queue.pop();
            path.draw(self.context);
            
            if(!self.rendering_queue.empty()) {
                setTimeout(self.draw_queue, 300);
            } else {
                setTimeout(self.draw_winning_path, 300);
            }
        }

        self.draw_winning_path = function() {
            self.winning_path.draw(self.context, {'line_width': 3, 'stroke_style': 'rgb(255, 215, 0);', 'show_distance': true});
            self.update_results();
        }

        self.set_start = function(start_city) {
            if(self.start_city) {
                self.start_city.set_as_normal();
            }

            start_city.set_as_start();
            self.start_city = start_city;
        }

        self.set_goal = function(goal_city) {
            if(self.goal_city) {
                self.goal_city.set_as_normal();
            }

            goal_city.set_as_goal();
            self.goal_city = goal_city; 
        }

        self.clicked = function() {
            var e = event;
            var x;
            var y;
            if (e.pageX || e.pageY) { 
                x = e.pageX;
                y = e.pageY;
            } else { 
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
            } 
            
            x -= self.canvas.offsetLeft;
            y -= self.canvas.offsetTop;

            var active_city;

            for(var city in romania.cities) {
                var bb = romania.cities[city].bounding_box();
                if(x >= bb.x1 && x <= bb.x2 && y >= bb.y1 && y <= bb.y2) {
                    active_city = romania.cities[city];
                }
            }

            if(self.start_city === active_city) {
                self.start_city = null;
                active_city.set_as_normal();
            }
            else if (self.goal_city === active_city) {
                self.goal_city = null;
                active_city.set_as_normal();
            }
            else if (self.start_city === null) {
                self.set_start(active_city);
                self.update_details();
            }
            else if (self.goal_city === null) {
                self.set_goal(active_city);
                self.update_details();
            }
            
            if(active_city) {
                active_city.draw(self.context);
            }
        }

        self.draw_map = function() {
            // Clear context.
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
            for(var i = 0; i < romania.roads.length; i++) { romania.roads[i].draw(self.context); }
            for(var city in romania.cities) { romania.cities[city].draw(self.context); }
        }

        self.get_route = function(graph, cost_func) {
            var frontier = PriorityQueue(),
                explored = [],
                start_path = Path([self.start_city]),
                goal = self.goal_city,
                steps = 0;

            start_path.cost = 0;
            frontier.push(0, start_path);

            while(true) {
                steps += 1

                if(frontier.empty()) { return false; }
                
                var path = frontier.pop();
                var state = path.end();
                
                self.rendering_queue.push(steps, path);

                if(state.name === goal.name) { return path; } 
                
                for(var i = 0; i < state.neighbors.length; i++) {
                    var neighbor = state.neighbors[i];
                    if(explored.indexOf(neighbor) === -1 || !self.in_frontier(frontier, neighbor)) {
                        var nodes = path.nodes.concat([graph[neighbor]]);
                        var new_path = Path(nodes);
                        var cost = cost_func(new_path);
                        new_path.cost = cost;
                        frontier.push(cost, new_path);
                    }
                }

                explored.push(state.name);
            }
        }

        self.in_frontier = function(frontier, city) {
            for(var i = 0; i < frontier.data.length; i++) {
                var path = frontier.data[i][1];
                for(var j = 0; i < path.nodes.length; i++) {
                    if(path.nodes[i].name === city) {
                        return true;
                    }
                }
            }

            return false
        }

        self.cost = {};

        self.cost.breadth_first = function(path) {
            return path.length();
        }

        self.cost.uniform_cost = function(path) {
            var cost = 0;
            for(var i = 0; i < path.nodes.length-1; i++) {
                cost += path.nodes[i].distance_to(path.nodes[i+1]);
            }

            return cost;
        }

        self.cost.a_star = function(path) {
            var end = path.end();
            var h = end.distance_to(self.goal_city);
            return self.cost.uniform_cost(path) + h;
        }


        return __init__();
    };
})();
