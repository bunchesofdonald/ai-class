(function(){
    window.map = {};

    map.city = function(spec) {
        var self = spec,
            stroke_style = '',
            fill_style = '',
            size = 10,
            start = spec.start || false,
            goal = spec.goal || false;

        self.bounding_box = function() {
            return {'x1': self.x - size, 'y1': self.y - size, 'x2': self.x + size, 'y2': self.y + size};
        }

        self.draw = function(context) {
            context.beginPath();
            
            context.lineWidth = 2;
            context.strokeStyle = stroke_style;
            context.fillStyle = fill_style;
            context.arc(spec.x, spec.y, size, 0, Math.PI*2, true);
            context.fill();
            context.stroke();
            
            context.fillStyle = 'rgb(0, 0, 0)';
            context.font="12pt Helvetica";
            
            var offset = context.measureText(self.name).width + 25;
            context.fillText(self.name, self.x - offset, self.y+10);
        }

        self.distance_to = function(city) {
            var a = Math.pow(Math.abs(self.x - city.x), 2),
                b = Math.pow(Math.abs(self.y - city.y), 2);

            return Math.sqrt(a + b);
        }

        self.set_as_start = function() {
            start = true;
            goal = false;
            fill_style = 'rgb(50, 205, 50)';
            stroke_style = 'rgb(50, 205, 50)';
        }

        self.set_as_goal = function() {
            start = false;
            goal = true;
            fill_style = 'rgb(178, 34, 34)';
            stroke_style = 'rgb(178, 34, 34)';
        }

        self.set_as_normal = function() {
            start = false;
            goal = false;
            fill_style = 'rgb(230, 230, 230)';
            stroke_style = "rgb(0, 140, 200)";
        }

        self.set_as_normal();
        return self;
    }

    map.road = function(city_a, city_b, spec) {
        var self = {};

        self.draw = function(context, options) {
            if(!options) { options = {'line_width': 2, 'stroke_style': 'rgb(120, 120, 120);', 'show_distance': true}; }
            context.beginPath();
            context.lineWidth = options.line_width;
            context.strokeStyle = options.stroke_style,
            context.moveTo(city_a.x, city_a.y);
            context.lineTo(city_b.x, city_b.y);
            context.stroke();

            if(options.show_distance) {
                var text_x = (city_a.x + city_b.x) / 2;
                var text_y = (city_a.y + city_b.y) / 2;
                context.fillStyle = 'rgb(0, 100, 230)';
                context.font="10pt Helvetica";
                context.fillText(self.distance().toFixed(0), text_x, text_y)
            }
        }

        self.distance = function() {
            return city_a.distance_to(city_b);
        }

        return self;
    }

})();
