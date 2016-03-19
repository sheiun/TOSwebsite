
var ROWS = 5;
var COLS = 6;
var TYPES = 7;
var ORB_X_SEP = 64;
var ORB_Y_SEP = 64;
var ORB_WIDTH = 60;
var ORB_HEIGHT = 60;
var MULTI_ORB_BONUS = 0.25;
var COMBO_BONUS = 0.25;
var MAX_SOLUTIONS_COUNT = ROWS * COLS * 8 ;

function make_rc(row, col) {
    return {row: row, col: col};
}

function make_match(type, count) {
    return {type: type, count: count};
}

function to_xy(rc) {
    var x = rc.col * ORB_X_SEP + ORB_WIDTH/2;
    var y = rc.row * ORB_Y_SEP + ORB_HEIGHT/2;
    return {x: x, y: y};
}

function copy_rc(rc) {
    return {row: rc.row, col: rc.col};
}

function equals_xy(a, b) {
    return a.x == b.x && a.y == b.y;
}

function equals_rc(a, b) {
    return a.row == b.row && a.col == b.col;
}

function create_empty_board() {
    var result = new Array(ROWS);
    for (var i = 0; i < ROWS; ++ i) {
        result[i] = new Array(COLS);
    }
    return result;
}

function get_board() {
    var result = create_empty_board();
    $('#grid > div').each(function() {
        var row = this.id.charAt(1);
        var col = this.id.charAt(2);
        var type = get_type(this);
        result[row][col] = type;
    });
    return result;
}

function ensure_no_X(board) {
    for (var i = 0; i < ROWS; ++ i) {
        for (var j = 0; j < COLS; ++ j) {
            if (board[i][j] == 'X') {
                throw 'Cannot have "?" orbs when solving.';
            }
        }
    }
}

function copy_board(board) {
    return board.map(function(a) { return a.slice(); });
}

function get_type(elem) {
    return elem.className.match(/e([\dX])/)[1];
}

function advance_type(type, dt) {
    if (type == 'X') {
        return '0';
    } else {
        var new_type = dt + +type;
        if (new_type < 0) {
            new_type += TYPES;
        } else if (new_type >= TYPES) {
            new_type -= TYPES;
        }
        return new_type;
    }
}

function get_weights() {
    var weights = new Array(TYPES);
    for (var i = 0; i < TYPES; ++ i) {
        weights[i] = {
            normal: +$('#e' + i + '-normal').val(),
            mass: +$('#e' + i + '-mass').val(),
        };
    }
    return weights;
}

function find_matches(board) {
    var match_board = create_empty_board();

    // 1. filter all 3+ consecutives.
    //  (a) horizontals
    for (var i = 0; i < ROWS; ++ i) {
        var prev_1_orb = 'X';
        var prev_2_orb = 'X';
        for (var j = 0; j < COLS; ++ j) {
            var cur_orb = board[i][j];
            if (prev_1_orb == prev_2_orb && prev_2_orb == cur_orb && cur_orb != 'X') {
                match_board[i][j] = cur_orb;
                match_board[i][j-1] = cur_orb;
                match_board[i][j-2] = cur_orb;
            }
            prev_1_orb = prev_2_orb;
            prev_2_orb = cur_orb;
        }
    }
    //  (b) verticals
    for (var j = 0; j < COLS; ++ j) {
        var prev_1_orb = 'X';
        var prev_2_orb = 'X';
        for (var i = 0; i < ROWS; ++ i) {
            var cur_orb = board[i][j];
            if (prev_1_orb == prev_2_orb && prev_2_orb == cur_orb && cur_orb != 'X') {
                match_board[i][j] = cur_orb;
                match_board[i-1][j] = cur_orb;
                match_board[i-2][j] = cur_orb;
            }
            prev_1_orb = prev_2_orb;
            prev_2_orb = cur_orb;
        }
    }

    var scratch_board = copy_board(match_board);

    // 2. enumerate the matches by flood-fill.
    var matches = [];
    for (var i = 0; i < ROWS; ++ i) {
        for (var j = 0; j < COLS; ++ j) {
            var cur_orb = scratch_board[i][j];
            if (typeof(cur_orb) == 'undefined') { continue; }
            var stack = [make_rc(i, j)];
            var count = 0;
            while (stack.length) {
                var n = stack.pop();
                if (scratch_board[n.row][n.col] != cur_orb) { continue; }
                ++ count;
                scratch_board[n.row][n.col] = undefined;
                if (n.row > 0) { stack.push(make_rc(n.row-1, n.col)); }
                if (n.row < ROWS-1) { stack.push(make_rc(n.row+1, n.col)); }
                if (n.col > 0) { stack.push(make_rc(n.row, n.col-1)); }
                if (n.col < COLS-1) { stack.push(make_rc(n.row, n.col+1)); }
            }
            matches.push(make_match(cur_orb, count));
        }
    }

    return {matches: matches, board: match_board};
}

function equals_matches(a, b) {
    if (a.length != b.length) {
        return false;
    }
    return a.every(function(am, i) {
        var bm = b[i];
        return am.type == bm.type && am.count == bm.count;
    });
}

function compute_weight(matches, weights) {
    var total_weight = 0;
    matches.forEach(function(m) {
        var base_weight = weights[m.type][m.count == 4 ? 'mass' : 'normal'];
        var multi_orb_bonus = (m.count - 3) * MULTI_ORB_BONUS + 1;
        total_weight += multi_orb_bonus * base_weight;
    });
    var combo_bonus = (matches.length - 1) * COMBO_BONUS + 1;
    return total_weight * combo_bonus;
}

function show_element_type(jqel, type) {
    jqel.removeClass('eX');
    for (var i = 0; i < TYPES; ++ i) {
        jqel.removeClass('e' + i);
    }
    jqel.addClass('e' + type);
}

function show_board(board) {
    for (var i = 0; i < ROWS; ++ i) {
        for (var j = 0; j < COLS; ++ j) {
            var type = board[i][j];
            if (typeof(type) == 'undefined') {
                type = 'X';
            }
            show_element_type($('#o' + i + '' + j), type);
        }
    }
}

function in_place_remove_matches(board, match_board) {
    for (var i = 0; i < ROWS; ++ i) {
        for (var j = 0; j < COLS; ++ j) {
            if (typeof(match_board[i][j]) != 'undefined') {
                board[i][j] = 'X';
            }
        }
    }
    return board;
}

function in_place_drop_empty_spaces(board) {
    for (var j = 0; j < COLS; ++ j) {
        var dest_i = ROWS-1;
        for (var src_i = ROWS-1; src_i >= 0; -- src_i) {
            if (board[src_i][j] != 'X') {
                board[dest_i][j] = board[src_i][j];
                -- dest_i;
            }
        }
        for (; dest_i >= 0; -- dest_i) {
            board[dest_i][j] = 'X';
        }
    }
    return board;
}

function can_move_orb(rc, dir) {
    switch (dir) {
        case 0: return                    rc.col < COLS-1;
        case 1: return rc.row < ROWS-1 && rc.col < COLS-1;
        case 2: return rc.row < ROWS-1;
        case 3: return rc.row < ROWS-1 && rc.col > 0;
        case 4: return                    rc.col > 0;
        case 5: return rc.row > 0      && rc.col > 0;
        case 6: return rc.row > 0;
        case 7: return rc.row > 0      && rc.col < COLS-1;
    }
    return false;
}

function in_place_move_rc(rc, dir) {
    switch (dir) {
        case 0:              rc.col += 1; break;
        case 1: rc.row += 1; rc.col += 1; break;
        case 2: rc.row += 1;              break;
        case 3: rc.row += 1; rc.col -= 1; break;
        case 4:              rc.col -= 1; break;
        case 5: rc.row -= 1; rc.col -= 1; break;
        case 6: rc.row -= 1;              break;
        case 7: rc.row -= 1; rc.col += 1; break;
    }
}

function in_place_swap_orb(board, rc, dir) {
    var old_rc = copy_rc(rc);
    in_place_move_rc(rc, dir);
    var orig_type = board[old_rc.row][old_rc.col];
    board[old_rc.row][old_rc.col] = board[rc.row][rc.col];
    board[rc.row][rc.col] = orig_type;
    return {board: board, rc: rc};
}

function copy_solution_with_cursor(solution, i, j, init_cursor) {
    return {board: copy_board(solution.board),
            cursor: make_rc(i, j),
            init_cursor: init_cursor || make_rc(i, j),
            path: solution.path.slice(),
            is_done: solution.is_done,
            weight: solution.weight,
            hweight: 0,
            matches: []};
}

function copy_solution(solution) {
    return copy_solution_with_cursor(solution,
                                     solution.cursor.row, solution.cursor.col,
                                     solution.init_cursor);
}

function make_solution(board) {
    return {board: copy_board(board),
            cursor: make_rc(0, 0),
            init_cursor: make_rc(0, 0),
            path: [],
            is_done: false,
            weight: 0,
            hweight: 0,
            matches: []};
}

function in_place_evaluate_solution(solution, weights) {
    var current_board = copy_board(solution.board);
    var all_matches = [];
    while (true) {
        var matches = find_matches(current_board);
        if (matches.matches.length == 0) {
            break;
        }
        in_place_remove_matches(current_board, matches.board);
        in_place_drop_empty_spaces(current_board);
        all_matches = all_matches.concat(matches.matches);
    }
    solution.weight = compute_weight(all_matches, weights);
    solution.matches = all_matches;
    return current_board;
}

function can_move_orb_in_solution(solution, dir) {
    // Don't allow going back directly. It's pointless.
    if (solution.path[solution.path.length-1] == (dir + 4) % 8) {
        return false;
    }
    return can_move_orb(solution.cursor, dir);
}

function in_place_swap_orb_in_solution(solution, dir) {
    var res = in_place_swap_orb(solution.board, solution.cursor, dir);
    solution.cursor = res.rc;
    solution.path.push(dir);
}

function get_max_hlevel() {
    return +$('#max-hlevel').val();
}

function get_max_path_length() {
    return +$('#max-length').val();
}

function is_8_dir_movement_supported() {
    return $('#allow-8')[0].checked;
}

function is_heuristic_supported() {
    return $('#allow-h')[0].checked;
}

var heuristic_board = function (s, weights, dir_step, steps, hval){

    if (steps <= 0) { return s.weight; }
//    if (hval - s.weight >= steps){ return s.weight; }
    
    s.hweight = s.weight;
    for (var dir = 0; dir < 8; dir += dir_step) {
        if (!can_move_orb_in_solution(s, dir)) {
            continue;
        }
        var solution = copy_solution(s);
        in_place_swap_orb_in_solution(solution, dir);
        in_place_evaluate_solution(solution, weights);
        var w = arguments.callee(solution, weights, dir_step, steps-1, hval);
        if(s.hweight < w) s.hweight = w;
    }
    return s.hweight;
}

function evolve_solutions(solutions, weights, dir_step, cur_step) {
    var new_solutions = [];
    solutions.forEach(function(s) {
        if (s.is_done) {
            return;
        }
        for (var dir = 0; dir < 8; dir += dir_step) {
            if (!can_move_orb_in_solution(s, dir)) {
                continue;
            }
            var solution = copy_solution(s);
            in_place_swap_orb_in_solution(solution, dir);
            in_place_evaluate_solution(solution, weights);
            new_solutions.push(solution);
        }
        s.is_done = true;
    });
    
    var count = solutions.length;

    /* Greedy Solution */
    if(!is_heuristic_supported()){
        solutions = solutions.concat(new_solutions.slice(0, MAX_SOLUTIONS_COUNT));
        solutions.sort(function(a, b) { return b.weight - a.weight; });
        return solutions;
    }

    /* Heuristic Solution */
    // if(cur_step%2==0){
//      solutions.sort(function(a, b) { return b.weight - a.weight; });
//      return solutions.slice(0, count+MAX_SOLUTIONS_COUNT);
//  }
    
    var rstep = get_max_path_length() - cur_step;
    if(rstep > get_max_hlevel()) rstep = get_max_hlevel();
    console.log(solutions.length);
    new_solutions.forEach(function(s) {
        s.hweight = heuristic_board(copy_solution(s), weights, dir_step, rstep, s.weight); 
    });
    new_solutions.sort(function(a, b) { return b.hweight - a.hweight; });
    solutions = solutions.slice(0, MAX_SOLUTIONS_COUNT);
    solutions = solutions.concat(new_solutions.slice(0, MAX_SOLUTIONS_COUNT));
    solutions.sort(function(a, b) { if(a.weight == b.weight) return a.path.length - b.path.length; return b.weight - a.weight; });
    return solutions;
}

function solve_board(board, step_callback, finish_callback) {
    var solutions = new Array(ROWS * COLS);
    var weights = get_weights();

    var seed_solution = make_solution(board);
    in_place_evaluate_solution(seed_solution, weights);

    for (var i = 0, s = 0; i < ROWS; ++ i) {
        for (var j = 0; j < COLS; ++ j, ++ s) {
            solutions[s] = copy_solution_with_cursor(seed_solution, i, j);
        }
    }

    var solve_state = {
        step_callback: step_callback,
        finish_callback: finish_callback,
        max_length: get_max_path_length(),
        dir_step: is_8_dir_movement_supported() ? 1 : 2,
        p: 0,
        solutions: solutions,
        weights: weights,
    };

    solve_board_step(solve_state);
}

function solve_board_step(solve_state) {
    if (solve_state.p >= solve_state.max_length) {
        solve_state.finish_callback(solve_state.solutions);
        return;
    }

    ++ solve_state.p;
    $('#solve').attr('value', 'Step '+solve_state.p);
    solve_state.solutions = evolve_solutions(solve_state.solutions,
                                             solve_state.weights,
                                             solve_state.dir_step,
                                             solve_state.p);
    solve_state.step_callback(solve_state.p, solve_state.max_length);

    setTimeout(function() { solve_board_step(solve_state); }, 0);
}

function add_solution_as_li(html_array, solution) {
    html_array.push('<li>W=');
    html_array.push(solution.weight.toFixed(2));
    html_array.push(', L=');
    html_array.push(solution.path.length);
    var sorted_matches = solution.matches.slice();
    sorted_matches.sort(function(a, b) {
        if (a.count != b.count) {
            return b.count - a.count;
        } else if (a.type > b.type) {
            return 1;
        } else if (a.type < b.type) {
            return -1;
        } else {
            return 0;
        }
    });
    sorted_matches.forEach(function(match, i) {
        html_array.push(', <span class="e');
        html_array.push(match.type);
        html_array.push('"></span> &times; ');
        html_array.push(match.count);
    });
    html_array.push('</li>');
}

function simplify_path(xys) {
    // 1. Remove intermediate points.
    var simplified_xys = [xys[0]];
    var xys_length_1 = xys.length - 1;
    for (var i = 1; i < xys_length_1; ++ i) {
        var dx0 = xys[i].x - xys[i-1].x;
        var dx1 = xys[i+1].x - xys[i].x;
        if (dx0 == dx1) {
            var dy0 = xys[i].y - xys[i-1].y;
            var dy1 = xys[i+1].y - xys[i].y;
            if (dy0 == dy1) {
                continue;
            }
        }
        simplified_xys.push(xys[i]);
    }
    simplified_xys.push(xys[xys_length_1]);

    return simplified_xys;
}

function simplify_solutions(solutions) {
    var simplified_solutions = [];
    solutions.forEach(function(solution) {
        for (var s = simplified_solutions.length-1; s >= 0; -- s) {
            var simplified_solution = simplified_solutions[s];
            if (!equals_rc(simplified_solution.init_cursor, solution.init_cursor)) {
                continue;
            }
            if (!equals_matches(simplified_solution.matches, solution.matches)) {
                continue;
            }
            return;
        }
        simplified_solutions.push(solution);
    });
    return simplified_solutions;
}

function draw_line_to(canvas, px, py, x, y) {
    var mx = (px*2 + x) / 3;
    var my = (py*2 + y) / 3;
    canvas.lineTo(mx, my);
    var dx = x - px;
    var dy = y - py;
    var dr = Math.sqrt(dx*dx + dy*dy) / 3;
    dx /= dr;
    dy /= dr;
    canvas.lineTo(mx - (dx+dy), my + (dx-dy));
    canvas.lineTo(mx - (dx-dy), my - (dx+dy));
    canvas.lineTo(mx, my);
    canvas.lineTo(x, y);
}

function draw_path(init_rc, path) {
    var canvas = clear_canvas();

    var rc = copy_rc(init_rc);
    var xys = [to_xy(rc)];
    path.forEach(function(p) {
        in_place_move_rc(rc, p);
        xys.push(to_xy(rc));
    });

    xys = simplify_path(xys);

    canvas.lineWidth = 4;
    canvas.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    canvas.beginPath();
    for (var i = 0; i < xys.length; ++ i) {
        var xy = xys[i];
        if (i == 0) {
            canvas.moveTo(xy.x, xy.y);
        } else {
            var prev_xy = xys[i-1];
            draw_line_to(canvas, prev_xy.x, prev_xy.y, xy.x, xy.y);
        }
    }
    canvas.stroke();

    var init_xy = xys[0];
    var final_xy = xys[xys.length-1];

    canvas.lineWidth = 2;
    canvas.fillStyle = 'red';
    canvas.strokeStyle = 'black';
    canvas.beginPath();
    canvas.rect(init_xy.x-5, init_xy.y-5, 10, 10);
    canvas.fill();
    canvas.stroke();

    canvas.fillStyle = 'lime';
    canvas.beginPath();
    canvas.rect(final_xy.x-5, final_xy.y-5, 10, 10);
    canvas.fill();
    canvas.stroke();

    return xys;
}

function clear_canvas() {
    var canvas_elem = $('#path')[0];
    var canvas = canvas_elem.getContext('2d');
    canvas.clearRect(0, 0, canvas_elem.width, canvas_elem.height);
    $('#hand').hide();
    return canvas;
}

var global_board = create_empty_board();
var global_solutions = [];
var global_index = 0;
var global_isDrag = false;

$(document).keypress( function(e) {
    switch(e.keyCode) {
        case 49: // red
            show_element_type($('#b0c'), '0');
            break;
        case 50: // green
            show_element_type($('#b0c'), '1');
            break;
        case 51: // blue
            show_element_type($('#b0c'), '2');
            break;
        case 52: // yellow
            show_element_type($('#b0c'), '3');
            break;
        case 53: // purple
            show_element_type($('#b0c'), '4');
            break;
        case 54: // pink
            show_element_type($('#b0c'), '5');
            break;
        case 55: // white
            show_element_type($('#b0c'), '6');
            break;
    }
});

$(document).mousedown( function(e){ global_isDrag = true; } );
$(document).mouseup( function(e){ global_isDrag = false; } );

$(document).ready(function() {
    $('#grid > div').each(function() {
        $(this).addClass('eX');
    })

    var $drawarea = $('#path');
    $('#grid').bind('mousewheel', function(e){
        type = $('#b0c').attr('class').match(/e([\dX])/)[1];
        if(e.originalEvent.wheelDelta > 0) {
            target_type = advance_type(type, -1);
        } else {
            target_type = advance_type(type, 1);
        }
        show_element_type($('#b0c'), target_type);
    });
    $drawarea.bind('mousewheel', function(e){
        alert('wheel'+e);
        type = $('#b0c').attr('class').match(/e([\dX])/)[1];
        if(e.originalEvent.wheelDelta > 0) {
            target_type = advance_type(type, -1);
        } else {
            target_type = advance_type(type, 1);
        }
        show_element_type($('#b0c'), target_type);
    });
    
    $('#obar > div, .change-target').mousedown(function(e) {
//        var old_type = get_type($('#b0c'));
//        var new_type = get_type(this);
//        console.log(old_type);
//        console.log(new_type);
//        old_type.css("border", "0");
//        new_type.css("border", "1px");
        show_element_type($('#b0c'), get_type(this));
    })

    var change_grid_orb = function(e) {
        var type = get_type(this);
        var target_type;
        target_type = $('#b0c').attr('class').match(/e([\dX])/)[1];
        show_element_type($(this), target_type);
        clear_canvas();
    };

    $('#grid > div, .change-target').mousedown(function(e) {
        var type = get_type(this);
        var target_type;
        target_type = $('#b0c').attr('class').match(/e([\dX])/)[1];
        show_element_type($(this), target_type);
        clear_canvas();
    });

    $('#grid > div, .change-target').mousemove(function(e) {
        if (!global_isDrag) return;
        var type = get_type(this);
        var target_type;
        switch (e.which) {
            case 1: target_type = advance_type(type, 1); break;     // left
            case 3: target_type = advance_type(type, -1); break;    // right
            case 2: target_type = 'X'; break;                       // middle
            default: break;
        }
        target_type = $('#b0c').attr('class').match(/e([\dX])/)[1];
        show_element_type($(this), target_type);
        clear_canvas();
    });

    $('#hand, #import-popup, #change-popup').hide();

    $('#profile-selector').change(function() {
        var values = this.value.split(/,/);
        for (var i = 0; i < TYPES; ++ i) {
            $('#e' + i + '-normal').val(values[2*i]);
            $('#e' + i + '-mass').val(values[2*i+1]);
        }
    });

    $('#solve').click(function() {
        var ts = new Date().getTime();
        var solver_button = this;
        var board = get_board();
        global_board = board;
        solver_button.disabled = true;
        solve_board(board, function(p, max_p) {
            //$('#status').text('Solving (' + p + '/' + max_p + ')...');
            var ms = new Date().getTime() - ts;
            $('#soltime').text(ms/1000 + "sec (s)");
        }, function(solutions) {
            var html_array = [];
            solutions = simplify_solutions(solutions);
            global_solutions = solutions;
            solutions.forEach(function(solution) {
                add_solution_as_li(html_array, solution, board);
            });
            $('#solutions > ol').html(html_array.join(''));
            solver_button.disabled = false;
            $('#solve').attr('value', 'Solve');
            ts = new Date().getTime() - ts;
            $('#soltime').text(ts/1000 + "sec (s)");
        });
    });

    $('#solutions').on('click', 'li', function(e) {
        show_board(global_board);
        global_index = $(this).index();
        var solution = global_solutions[global_index];
        var path = draw_path(solution.init_cursor, solution.path);
        var hand_elem = $('#hand');
        hand_elem.stop(/*clearQueue*/true).show();
        path.forEach(function(xy, i) {
            var left = xy.x + 13;
            var top = xy.y + 13;
            hand_elem[i == 0 ? 'offset' : 'animate']({left: left, top: top});
        });
        $('#solutions li.prev-selection').removeClass('prev-selection');
        $(this).addClass('prev-selection');
    });

    $('#randomize').click(function() {
        var types = $('#randomization-type').val().split(/,/);
        $('#grid > div').each(function() {
            var index = Math.floor(Math.random() * types.length);
            show_element_type($(this), types[index]);
        });
        clear_canvas();
    });

    $('#clear').click(function() {
        $('#grid > div').each(function() { show_element_type($(this), 'X'); });
        clear_canvas();
    });

    $('#drop').click(function() {
        var solution = global_solutions[global_index];
        if (!solution) {
            return;
        }
        var board = in_place_evaluate_solution(solution, get_weights());
        show_board(board);
        clear_canvas();
    });

    $('#final').click(function() {
        var solution = global_solutions[global_index];
        if (solution) {
            show_board(solution.board);
        }
    });

    $('#import').click(function() {
        var board = get_board();
        var type_chars = 'rgbyphj';
        var content = board.map(function(row) { return row.join(''); }).join('\n')
            .replace(/X/g, '.')
            .replace(/(\d)/g, function(s) { return type_chars.charAt(s); });
        $('#import-textarea').val(content);
        $('#import-popup').show();
    });

    $('#change').click(function() { $('#change-popup').show(); });
    $('#import-cancel').click(function() { $('#import-popup').hide(); });
    $('#change-cancel').click(function() { $('#change-popup').hide(); });

    $('#import-clear').click(function() {
        $('#import-textarea').val('');
    });
    $('#import-import').click(function() {
        var board_raw = $('#import-textarea').val();
        var board_joined = board_raw
                .replace(/r/gi, '0')
                .replace(/g/gi, '1')
                .replace(/b/gi, '2')
                .replace(/y/gi, '3')
                .replace(/p/gi, '4')
                .replace(/h/gi, '5')
                .replace(/j/gi, '6')
                .replace(/\s/g, '')
                .replace(/[^0-6]/g, 'X');
        if (board_joined.length != ROWS * COLS) {
            alert('Wrong number of orbs!');
            return;
        }
        var board = board_joined.match(/.{6}/g).map(function(s) { return s.split(''); });
        show_board(board);
        clear_canvas();
        $('#import-popup').hide();
    });

    $('#change-change').click(function() {
        var change_targets = $('.change-target').map(function() {
            return get_type(this);
        });
        var board = get_board();
        for (var i = 0; i < ROWS; ++ i) {
            for (var j = 0; j < COLS; ++ j) {
                var type = board[i][j];
                if (type == 'X') {
                    type = change_targets[change_targets.length-1];
                } else {
                    type = change_targets[type];
                }
                board[i][j] = type;
            }
        }
        show_board(board);
        clear_canvas();
        $('#change-popup').hide();
    });
    
    $('#serizawa').click(function() {
        var board = get_board();
        var layout = board.map(function(row) { return row.join(''); }).join('');
        
        var route = 'null';
        var solution = global_solutions[global_index];
        var solution_init = solution.init_cursor['col'] + '' + (solution.init_cursor['row']+5);
        console.log(solution_init);
        var dir_chars = '42103567'
        var solution_path = solution.path.join('').replace(/(\d)/g, function(s) { return dir_chars.charAt(s); });
        console.log(solution_path);
        route = solution_init + ',' + solution_path;
        
        var url = 'http://serizawa.web5.jp/puzzdra_theory_maker/index.html?layout=' + layout + '&route=' + route + '&ctwMode=false';
        window.open(url);
    });
});
