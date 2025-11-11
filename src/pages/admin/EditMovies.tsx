import { useState ,useEffect} from "react"
import { useParams,useNavigate } from "react-router-dom"
import type { MovieType } from "../../types/MovieType"
export default function EditMovies() {
	const [formData, setFormData] = useState<MovieType>({
		title: "",
		description: "",
		genre: "",
		duration_minutes: "",
		release_date: "",
		poster_url: "",
	});
	const {id } =useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState("")

	// New: list state to show movies when no id is provided
	const [movies, setMovies] = useState<any[]>([])

	// Fetch a single movie when editing
	async function fetchMovieData(){
		setLoading(true)
		try {
			const res = await fetch(`https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${id}`);
			if (!res.ok){ throw new Error("Failed to fetch movie data")}
			const data = await res.json();
			setFormData({
				title: data.title ?? "",
				description: data.description ?? "",
				genre: data.genre ?? "",
				// store duration as string for the form; convert blank/null to ""
				duration_minutes: data.duration_minutes == null ? "" : String(data.duration_minutes),
				release_date: data.release_date ?? "",
				poster_url: data.poster_url ?? "",
			})
		}catch(err){
			console.error("Error fetching movie data:", err);
		} finally{
			setLoading (false)
		}
	}

	// New: fetch movies list when no id param
	async function fetchMoviesList(){
		setLoading(true)
		try {
			const res = await fetch(`https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies`);
			if (!res.ok){ throw new Error("Failed to fetch movies list") }
			const data = await res.json();
			// expect data to be an array of movies
			setMovies(Array.isArray(data) ? data : [])
		} catch (err) {
			console.error("Error fetching movies list:", err)
		} finally {
			setLoading(false)
		}
	}

	// Fix: call the proper fetch function depending on presence of id
	useEffect(() => {
		if (id) {
			fetchMovieData()
		} else {
			fetchMoviesList()
		}
	}, [id])

	const handleChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!id) {
			alert("Missing movie id")
			return
		}

		try {
			const res = await fetch(`https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					// convert duration string back to number or null
					duration_minutes: formData.duration_minutes === "" ? null : Number(formData.duration_minutes),
				}),
			})

			if (res.ok) {
				setSuccessMessage("Movie updated successfully!")
				// optionally navigate back to list after a short delay
				setTimeout(() => navigate("/movies"), 900)
			} else {
				const text = await res.text()
				console.error("Update failed:", text)
				alert("Failed to update movie")
			}
		} catch (error) {
			console.error("Error updating movie:", error)
			alert("Error updating movie")
		}
	}

	if (loading) return <div>Loading...</div>

	// Render movies list when no id param
	if (!id) {
		return (
			<div>
				<h2>Movies</h2>
				{movies.length === 0 ? (
					<div>No movies found.</div>
				) : (
					<ul>
						{movies.map((m) => (
							<li key={m.id ?? m._id ?? m.title}>
								<div style={{display: "flex", alignItems: "center", gap: 12}}>
									<span>{m.title ?? "Untitled"}</span>
									<button onClick={() => {
										// Navigate to this same route with the movie id appended.
										// Adjust the path below to match your router if needed.
										navigate(`/admin/movies/edit/${m.id ?? m._id}`)
									}}>Edit</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		)
	}

	// When id exists, render the edit form
	return (
		<div>
			<div>
				<form className="movie-form" onSubmit={handleSubmit}>
					<h2>Edit Movie</h2>
					{successMessage && <div className="success-message">{successMessage}</div>}

					<div className="form-group">
						<label>Title</label>
						<input name="title" value={formData.title} onChange={handleChange} required />
					</div>

					<div className="form-group">
						<label>Description</label>
						<textarea name="description" value={formData.description} onChange={handleChange} required />
					</div>

					<div className="form-group">
						<label>Genre</label>
						<input name="genre" value={formData.genre} onChange={handleChange} />
					</div>

					<div className="form-group">
						<label>Movie Duration (minutes)</label>
						<input name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} />
					</div>

					<div className="form-group">
						<label>Release Date</label>
						<input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
					</div>

					<div className="form-group">
						<label>Poster URL</label>
						<input name="poster_url" value={formData.poster_url} onChange={handleChange} />
					</div>

					<button type="submit">Save Changes</button>
					{/* Back to list */}
					<button type="button" onClick={() => navigate(-1)} style={{marginLeft: 8}}>Back to list</button>
				</form>
			</div>
		</div>
	)
}
