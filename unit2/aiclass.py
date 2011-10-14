#!/usr/bin/env python

hungary = {
    "Arad": [("Sibiu", 140), ("Timisoara", 118), ("Zerind", 75)],
    "Bucharest": [("Urziceni", 85), ("Giurgiu", 90), ("Pitesti", 101), ("Fagaras", 211)],
    "Craiova": [("Pitesti", 138), ("Rimmicu", 146), ("Dobreta", 120)],
    "Dobreta": [("Craiova", 120), ("Mehadia", 75)],
    "Eforie": [("Hirsova", 86)],
    "Fagaras": [("Sibiu", 99), ("Bucharest", 211)],
    "Giurgiu": [("Bucharest", 90)],
    "Hirsova": [("Eforie", 86), ("Urziceni", 98)],
    "Iasi": [("Neamt", 87), ("Vaslui", 92)],
    "Lugoj": [("Timisoara", 111), ("Mehadia", 70)],
    "Mehadia": [("Lugoj", 70), ("Dobreta", 75)],
    "Neamt": [("Iasi", 87)],
    "Oradea": [("Zerind", 71), ("Sibiu", 151)],
    "Pitesti": [("Rimmicu", 97), ("Bucharest", 101), ("Craiova", 138)],
    "Rimmicu": [("Pitesti", 97), ("Sibiu", 80), ("Craiova", 146)],
    "Sibiu": [("Oradea", 151), ("Fagaras", 99), ("Arad", 140), ("Rimmicu", 80)],
    "Timisoara": [("Arad", 118), ("Lugoj", 111)],
    "Urziceni": [("Bucharest", 85), ("Hirsova", 98), ("Vaslui", 142)],
    "Vaslui": [("Urziceni", 142), ("Iasi", 92)],
    "Zerind": [("Arad", 75), ("Oradea", 71)]
}

# Hueristic for A*
distance_to_bucharest = {
    "Arad": 366,
    "Bucharest": 0,
    "Craiova": 160,
    "Dobreta": 242,
    "Eforie": 161,
    "Fagaras": 178,
    "Giurgiu": 77,
    "Hirsova": 151,
    "Iasi": 226,
    "Lugoj": 244,
    "Mehadia": 241,
    "Neamt": 234,
    "Oradea": 380,
    "Pitesti": 98,
    "Rimmicu": 193,
    "Sibiu": 253,
    "Timisoara": 329,
    "Urziceni": 80,
    "Vaslui": 199,
    "Zerind": 374
}

class PriorityQueue(object):
    def __init__(self):
        self.data = []

    def empty(self):
        return len(self.data) == 0

    def front(self):
        return self.data[0] if not self.empty() else None

    def pop(self):
        index = min(enumerate(self.data), key=lambda e: e[1][0])[0]
        return self.data.pop(index)
    
    def push(self, priority, datum):
        self.data.append((priority, datum))

    def __iter__(self):
        for datum in self.data:
            for d in datum[1]:
                yield d


class Path(object):
    def __init__(self, nodes = None):
        self.nodes = nodes or []

    def __len__(self):
        return len(self.nodes)
    
    def __repr__(self):
        return " -> ".join(str(x) for x in self.nodes)

    def __iter__(self):
        for node in self.nodes:
            yield node[0]
    
    def end(self):
        return self.nodes[-1]


def graph_search(graph, start, goal, priority):
    start_path = Path([(start, 0)])
    frontier = PriorityQueue()
    frontier.push(0, start_path)
    explored = [start]
    steps = 0

    while(True):
        if frontier.empty():
            return False

        cost, path = frontier.pop()
        state = path.end()[0]
        steps += 1
        
        if state == goal:
            return path, steps

        for node in graph[state]:
            if node[0] not in explored or node[0] not in frontier:
                new_path = Path(path.nodes + [node])
                frontier.push(priority(new_path), new_path)
        
        explored.append(state)

def uniform_cost(path):
    return sum(node[1] for node in path.nodes)

def breadth_first(path):
    return len(path)

def depth_first(path):
    return breadth_first(path) * -1

def a_star(path):
    return distance_to_bucharest[path.end()[0]] + uniform_cost(path)

breadth = graph_search(hungary, "Sibiu", "Bucharest", breadth_first)
depth = graph_search(hungary, "Sibiu", "Bucharest", depth_first)
uniform = graph_search(hungary, "Arad", "Bucharest", uniform_cost)
star = graph_search(hungary, "Sibiu", "Bucharest", a_star)

print "%s | steps: %d -- cost: %d" % (breadth[0], breadth[1], uniform_cost(breadth[0]))
print "%s | steps: %d -- cost: %d" % (depth[0], depth[1], uniform_cost(depth[0]))
print "%s | steps: %d -- cost: %d" % (uniform[0], uniform[1], uniform_cost(uniform[0]))
print "%s | steps: %d -- cost: %d" % (star[0], star[1], uniform_cost(star[0]))
