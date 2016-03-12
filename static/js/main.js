function recursiveDrawRectangles(canv, rect, level, color) {
    if (color === void 0) { color = undefined; }
    var ctx = canv.getContext("2d");
    if (rect.children.length == 0) {
        ctx.strokeStyle = color || "#FF0000";
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(rect.x, canv.height - rect.y, rect.width, -rect.height);
        ctx.setLineDash([]);
        ctx.fillStyle = color || "#FF0000";
        ctx.font = "20px serif";
        ctx.fillText(rect.data != null ? rect.data : "query", rect.x + rect.width / 2, canv.height - rect.y - rect.height / 2);
    }
    else if (rect.children.length > 0) {
        ctx.strokeStyle = "#000000";
        ctx.setLineDash([15, 15]);
        ctx.strokeRect(rect.x, canv.height - rect.y, rect.width, -rect.height);
        ctx.setLineDash([]);
        ctx.font = "20px serif";
        ctx.fillStyle = "#000000";
        ctx.fillText(level.toString(), rect.x + rect.width - 20, canv.height - rect.y - rect.height + 20);
        _.forEach(rect.children, function (r) {
            recursiveDrawRectangles(canv, r, level + 1);
        });
    }
}
function createTree(maxNodes, numberOfNodes, canvas, batchCreate, renderConstruction) {
    var tree = new RTree(maxNodes);
    var maxX = (canvas.width - 100);
    var maxY = (canvas.height - 100);
    var minWidth = 20;
    var minHeight = 20;
    var maxWidth = minWidth + 10;
    var maxHeight = minHeight + 10;
    var nodes = _.map(_.range(numberOfNodes), function (i) {
        var data = {};
        data.x = Math.floor(Math.random() * (maxX - minWidth));
        data.y = Math.floor(Math.random() * (maxY - minHeight));
        data.width = Math.min(maxWidth, Math.floor(Math.random() * (maxX - data.x)) + minWidth);
        data.height = Math.min(maxHeight, Math.floor(Math.random() * (maxY - data.y)) + minHeight);
        data.data = i;
        return data;
    });
    var ctx = canvas.getContext("2d");
    if (batchCreate) {
        tree.batchInsert(nodes);
    }
    else {
        if (renderConstruction) {
            for (var i = 0; i < nodes.length; i++) {
                setTimeout(function (i) {
                    tree.insert(nodes[i]);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    recursiveDrawRectangles(canvas, tree.root, 1);
                }, 100 * i, i);
            }
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                tree.insert(nodes[i]);
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recursiveDrawRectangles(canvas, tree.root, 1);
    return tree;
}
function searchTree(tree, x, y, width, height, canvas, viewModel) {
    var searchRect = {
        x: x,
        y: y,
        width: width,
        height: height
    };
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recursiveDrawRectangles(canvas, tree.root, 1);
    recursiveDrawRectangles(canvas, new RTreeRectangle(x, y, width, height, null), 1, "#0000ff");
    var results = tree.search(searchRect);
    viewModel.searchResults.removeAll();
    _.forEach(results, function (id) {
        viewModel.searchResults.push(id);
    });
    return results;
}
$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var $overlay = $(canvas);
    $overlay.attr("width", $overlay.parent().outerWidth() - 10);
    $overlay.attr("height", $overlay.parent().outerHeight() - 10);
    var tree = null;
    var myViewModel = {
        searchResults: ko.observableArray(),
        batchConstruct: ko.observable(true),
        intermediateRender: ko.observable(false),
        createNewTree: function () {
            var maxNodes = 4, numberOfNodes = 20;
            tree = createTree(maxNodes, numberOfNodes, canvas, myViewModel.batchConstruct(), myViewModel.intermediateRender());
        },
        queryTree: function () {
            searchTree(tree, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2, canvas, myViewModel);
        }
    };
    ko.applyBindings(myViewModel);
    myViewModel.createNewTree();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsaUNBQWtDLElBQXVCLEVBQUUsSUFBb0IsRUFBRSxLQUFhLEVBQUUsS0FBc0I7SUFBdEIscUJBQXNCLEdBQXRCLGlCQUFzQjtJQUNySCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWhDLEVBQUUsQ0FBQSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUUsQ0FBQyxDQUFBLENBQUM7UUFDL0IsR0FBRyxDQUFDLFdBQVcsR0FBRSxLQUFLLElBQUksU0FBUyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixHQUFHLENBQUMsU0FBUyxHQUFFLEtBQUssSUFBSSxTQUFTLENBQUM7UUFDbEMsR0FBRyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7UUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pILENBQUM7SUFDRCxJQUFJLENBQUMsRUFB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