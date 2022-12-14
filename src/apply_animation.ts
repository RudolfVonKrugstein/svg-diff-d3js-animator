import * as d3 from 'd3';

/** Helper function to create an HTML String containing an SVG
 * to an SVG Element.
 * @param html The html String
 */
function html_to_svg_element(html: string): ChildNode {
    const template = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    html = html.trim();
    template.innerHTML = html;
    return template.firstChild!;
}

async function apply_remove_animation(diff: any) {
    console.log("removing");
    await d3.select('#' + diff.id)
        .attr("opacity", 1.0)
        .transition()
        .duration(1000)
        .attr("opacity", 0.0).remove()
        .end();
}


async function apply_add_animation(diff: any) {
    console.log("adding");
    if (diff.next_child_id !== undefined) {
        document.getElementById(diff.parent_id)!.insertBefore(
            html_to_svg_element(diff.svg)!,
            document.getElementById(diff.next_child_id)
        );
    } else {
        document.getElementById(diff.parent_id)!.appendChild(html_to_svg_element(diff.svg)!);
    }
    await d3.select('#' + diff.id)
        .attr('opacity', 0.0)
        .transition()
        .duration(1000)
        .attr('opacity', 1.0)
        .end();
}

async function apply_change_animation(diff: any) {
    console.log("change");
    const el = d3.select('#' + diff.id);
    const dom_element = document.getElementById(diff.id);
    for (const remove of diff.removes) {
        el.attr(remove, null)
    }

    const anim = el.transition().duration(1000);
    for (const change of diff.changes) {
        anim.attr(change.prop, change.end);
    }
    for (const change of diff.adds) {
        anim.attr(change.prop, change.value);
    }
    await anim.end();
}

async function apply_change_text_animation(diff: any) {
    console.log("change");
    const el = d3.select('#' + diff.id);
    const dom_element = document.getElementById(diff.id);
    for (const remove of diff.removes) {
        el.attr(remove, null)
    }

    const anim = el.transition().duration(1000);
    for (const change of diff.changes) {
        anim.attr(change.prop, change.end);
    }
    for (const change of diff.adds) {
        anim.attr(change.prop, change.value);
    }
    await anim.end();
}

export default async function apply_animation(diffs: any[]) {
    await Promise.all(diffs.map(async (diff) => {
        switch (diff.action) {
            case "remove":
                await apply_remove_animation(diff);
                break;
            case "add":
                await apply_add_animation(diff);
                break;
            case "change":
                await apply_change_animation(diff);
                break;
            case "change_text":
                await apply_change_text_animation(diff);
                break;
        }

    }));
}
