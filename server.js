export default {
    fetch(req) {
        return new Response(req.url)
    },
}