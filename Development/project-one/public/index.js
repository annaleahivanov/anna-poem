const width = 964;
const height = 600;

let edgeColor = 'path';

const _sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);
  const sankey = ({nodes, links}) => _sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });


  const f = d3.format(",.0f");
  const format = d => `${f(d)} TWh`;

  const _color = d3.scaleOrdinal(d3.schemeCategory10);
  const color = name => _color(name.replace(/ .*/, ""));
  var data = {
    nodes: [
        { name: "Node 0" },
        { name: "Node 1" },
        { name: "Node 2" },
        { name: "Node 3" },
        { name: "Node 4" }
    ],
    links: [
        { source: 0, target: 2, value: 2 },
        { source: 1, target: 2, value: 2 },
        { source: 1, target: 3, value: 2 },
        { source: 0, target: 4, value: 2 },
        { source: 2, target: 3, value: 2 },
        { source: 2, target: 4, value: 2 },
        { source: 3, target: 4, value: 4 }
    ]
};
const svg = d3.select('#chart')
			.attr("viewBox", `0 0 ${width} ${height}`)
      .style("width", "100%")
      .style("height", "auto");
      

  svg.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name))
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");
      
      const select = document.querySelector('#colorSelect');
select.onchange = () => {
  edgeColor = select.value;
  update();
};

function update() {
  if (edgeColor === "path") {
    const gradient = link.append("linearGradient")
        .attr("id", (d,i) => {
        //  (d.uid = DOM.uid("link")).id
        const id = `link-${i}`;
        d.uid = `url(#${id})`;
        return id;
        })
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.name));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.name));
  }

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => edgeColor === "path" ? d.uid
          : edgeColor === "input" ? color(d.source.name)
          : color(d.target.name))
      .attr("stroke-width", d => Math.max(1, d.width));
      }
      
      update();

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

//d3 = require("d3@5", "d3-sankey@0.7")
});