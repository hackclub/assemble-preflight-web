export default function (req, res) {
    res.json({
        query: req.query,
        params: req.params
    });
}