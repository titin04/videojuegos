import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBox({ busqueda, setBusqueda }) {
  return (
    <TextField
      fullWidth
      placeholder="Buscar videojuegos..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: { borderRadius: 2 }
      }}
    />
  );
}

export default SearchBox;
