export default async function load_svg(container_id: string, svg: string) {
    const target = document.getElementById(container_id);
    if (target != null) {
        target.innerHTML = svg;
    } else {
        throw `Unable to find element with id ${container_id}`;
    }
}
