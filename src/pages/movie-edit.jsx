import $api from "../api/api";
import {useEffect, useState, Fragment} from "react";
import {Button, Form, Modal, Table} from "react-bootstrap";
import Joi from "joi";
import toast from "react-hot-toast";

const genreIdToName = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
}

const genreNameToId = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    'Science Fiction': 878,
    Thriller: 53,
    'TV Movie': 10770,
    War: 10752,
    Western: 37
}

const schema = Joi.object({
        title: Joi.string().required(),
        releaseDate: Joi.date().required(),
        description: Joi.string().min(10).required(),
        price: Joi.number().min(0).required(),
        url: Joi.string().uri().required(),
        trailer: Joi.string().required(),
        posterUrl: Joi.string().uri().required(),
        backdropUrl: Joi.string().uri().required(),
        genres: Joi.string().required()
    }
)

function CreateMovieModal(props) {
    let title = props.defs.title
    let releaseDate = props.defs.releaseDate
    let description = props.defs.description
    let price = props.defs.price
    let url = props.defs.url
    let trailer = props.defs.trailer
    let posterUrl = props.defs.posterUrl
    let backdropUrl = props.defs.backdropUrl
    let genres = props.defs.genres

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="inp1">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" defaultValue={title} onChange={e => {
                            title = e.target.value
                        }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp2">
                        <Form.Label>Release Date</Form.Label>
                        <Form.Control type="date" defaultValue={releaseDate}
                                      onChange={e => {
                                          releaseDate = e.target.value
                                      }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" defaultValue={description} rows={3}
                                      onChange={e => {
                                          description = e.target.value
                                      }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp4">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" defaultValue={price} onChange={e => {
                            price = e.target.value
                        }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp5">
                        <Form.Label>Url</Form.Label>
                        <Form.Control type="text" defaultValue={url} onChange={e => {
                            url = e.target.value
                        }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp6">
                        <Form.Label>Trailer</Form.Label>
                        <Form.Control type="text" defaultValue={trailer}
                                      onChange={e => {
                                          trailer = e.target.value
                                      }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp7">
                        <Form.Label>Poster Url</Form.Label>
                        <Form.Control type="text" defaultValue={posterUrl}
                                      onChange={e => {
                                          posterUrl = e.target.value
                                      }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp8">
                        <Form.Label>Backdrop Url</Form.Label>
                        <Form.Control type="text" defaultValue={backdropUrl}
                                      onChange={e => {
                                          backdropUrl = e.target.value
                                      }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inp8">
                        <Form.Label>Genres (separate by ';')</Form.Label>
                        <Form.Control type="text" defaultValue={genres} onChange={e => {
                            genres = e.target.value
                        }}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Cancel</Button>
                <Button onClick={() => {
                    const {error, value} = schema.validate({
                        title,
                        releaseDate,
                        description,
                        price,
                        url,
                        trailer,
                        posterUrl,
                        backdropUrl,
                        genres
                    })

                    if (error) {
                        toast(error.message)
                        return;
                    }
                    value.genres = value.genres.split(';').map(g => genreNameToId[g])
                    props.onSave(value)
                    // $api.post("/admin/movie", value).then(res => {
                    //     props.onSuccess(res.data)
                    // })
                }}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

const MovieEdit = () => {
    const [modalShow, setModalShow] = useState(false)
    const [movies, setMovies] = useState([])
    const [onSave, setOnSave] = useState(() => {})
    const [defs, setDefs] = useState({})
    useEffect(() => {
        $api.get('/admin/all').then(res => {
                setMovies(res.data);
                console.log(res.data)
            }
        )
    }, [])

    return (<Fragment>
        <Button variant="success" onClick={(() => {
            setDefs({})
            setOnSave(() => (data) => {
                $api.post("/admin/movie", data).then(res => {
                    setMovies([...movies, res.data])
                    setModalShow(false)
                })
            })
            setModalShow(true)
        })}>New</Button>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>id</th>
                <th>title</th>
                <th>releaseDate</th>
                <th>description</th>
                <th>price</th>
                <th>url</th>
                <th>trailer</th>
                <th>posterUrl</th>
                <th>backdropUrl</th>
                <th>genres</th>
            </tr>
            </thead>
            <tbody>
            {movies.map(m => <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.title}</td>
                <td>{m.releaseDate}</td>
                <td>{m.description}</td>
                <td>{m.price}</td>
                <td>{m.url}</td>
                <td>{m.trailer}</td>
                <td>{m.posterUrl}</td>
                <td>{m.backdropUrl}</td>
                <td>{m.genres.map(g => g.name).join(';')}</td>
                <td><Button onClick={() => {
                    setDefs({})
                    setDefs({
                        title: m.title,
                        releaseDate: m.releaseDate,
                        description: m.description,
                        price: m.price,
                        url: m.url,
                        trailer: m.trailer,
                        posterUrl: m.posterUrl,
                        backdropUrl: m.backdropUrl,
                        genres: m.genres.map(g => g.name).join(';')
                    })

                    setOnSave(() => (data) => {
                        $api.put(`/admin/movie/${m.id}`, data).then(res => {

                            movies[movies.findIndex(mv => mv.id = res.data.id)] = res.data
                            setMovies(movies)
                            setModalShow(false)
                        })
                    })

                    setModalShow(true)
                }}>Edit</Button><Button variant='danger' onClick={() => {
                    $api.delete(`/admin/movie/${m.id}`).then(_ => {
                        setMovies(movies.filter(mv => mv.id !== m.id))
                    })
                }}>Delete</Button></td>
            </tr>)}
            </tbody>
        </Table>
        <CreateMovieModal defs={defs} show={modalShow} onHide={() => setModalShow(false)} onSave={onSave}/>
    </Fragment>)
}

export default MovieEdit