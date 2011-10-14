(function(){
    window.romania = {};

    romania.cities = {
        "Arad": map.city({'name': 'Arad', 'x': 109, 'y': 147, 'neighbors': ['Sibiu', 'Timisoara', 'Zerind']}),
        "Zerind": map.city({'name': 'Zerind', 'x': 129, 'y': 77, 'neighbors': ['Arad', 'Oradea']}),
        "Oradea": map.city({'name': 'Oradea', 'x': 160, 'y': 26, 'neighbors': ['Zerind', 'Sibiu']}),
        "Timisoara": map.city({'name': 'Timisoara', 'x': 109, 'y': 248, 'neighbors': ['Arad', 'Lugoj']}),
        "Lugoj": map.city({'name': 'Lugoj', 'x': 210, 'y': 289, 'neighbors': ['Timisoara','Mehadia']}),
        "Mehadia": map.city({'name': 'Mehadia', 'x': 210, 'y': 349, 'neighbors': ['Lugoj', 'Dobreta']}),
        "Dobreta": map.city({'name': 'Dobreta', 'x': 200, 'y': 389, 'neighbors': ['Mehadia', 'Craiova']}),
        "Sibiu": map.city({'name': 'Sibiu', 'x': 250, 'y': 158, 'neighbors': ['Arad', 'Oradea', 'Fagaras', 'Rimmicu']}),
        "Rimmicu": map.city({'name': 'Rimmicu', 'x': 281, 'y': 228, 'neighbors': ['Sibiu', 'Pitesti', 'Craiova']}),
        "Craiova": map.city({'name': 'Craiova', 'x': 311, 'y': 410, 'neighbors': ['Dobreta', 'Rimmicu', 'Pitesti']}),
        "Fagaras": map.city({'name': 'Fagaras', 'x': 372, 'y': 178, 'neighbors': ['Sibiu', 'Bucharest']}),
        "Pitesti": map.city({'name': 'Pitesti', 'x': 372, 'y': 289, 'neighbors': ['Rimmicu', 'Bucharest', 'Craiova']}),
        "Bucharest": map.city({'name': 'Bucharest', 'x': 493, 'y': 329, 'neighbors': ['Pitesti', 'Giurgiu', 'Urziceni']}),
        "Giurgiu": map.city({'name': 'Giurgiu', 'x': 432, 'y': 430, 'neighbors': ['Bucharest']}),
        "Urziceni": map.city({'name': 'Urziceni', 'x': 563, 'y': 299, 'neighbors': ['Bucharest', 'Hirsova', 'Vaslui']}),
        "Hirsova": map.city({'name': 'Hirsova', 'x': 694, 'y': 299, 'neighbors': ['Urziceni', 'Eforie']}),
        "Eforie": map.city({'name': 'Eforie', 'x': 725, 'y': 379, 'neighbors': ['Hirsova']}),
        "Vaslui": map.city({'name': 'Vaslui', 'x': 644, 'y': 187, 'neighbors': ['Urziceni', 'Iasi']}),
        "Iasi": map.city({'name': 'Iasi', 'x': 593, 'y': 117, 'neighbors': ['Vaslui', 'Neamt']}),
        "Neamt": map.city({'name': 'Neamt', 'x': 492, 'y': 76, 'neighbors': ['Iasi']})
    };

    var roads = [
        ['Arad','Zerind'], ['Zerind','Oradea'], ['Arad', 'Timisoara'],
        ['Zerind', 'Oradea'], ['Timisoara', 'Lugoj'], ['Lugoj', 'Mehadia'],
        ['Mehadia', 'Dobreta'], ['Arad', 'Sibiu'], ['Oradea', 'Sibiu'],
        ['Sibiu', 'Rimmicu'], ['Rimmicu', 'Craiova'], ['Dobreta', 'Craiova'],
        ['Sibiu', 'Fagaras'], ['Fagaras', 'Bucharest'], ['Rimmicu', 'Pitesti'],
        ['Craiova', 'Pitesti'], ['Pitesti', 'Bucharest'], ['Giurgiu', 'Bucharest'],
        ['Bucharest', 'Urziceni'], ['Urziceni', 'Hirsova'], ['Hirsova', 'Eforie'],
        ['Urziceni', 'Vaslui'], ['Vaslui', 'Iasi'], ['Iasi', 'Neamt']
    ];
    
    romania.roads = [];

    for(var i = 0; i < roads.length; i++) {
        var city_a = romania.cities[roads[i][0]];
        var city_b = romania.cities[roads[i][1]];
        romania.roads[i] = map.road(city_a, city_b);
    }
})();
