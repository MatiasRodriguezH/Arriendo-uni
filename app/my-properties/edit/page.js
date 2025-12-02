"use client";

import { useEffect, useState, useCallback} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import Direccion from "@/components/rental/Direccion";
import Contacto from "@/components/rental/Contacto";
import ImagePreview from "@/components/ImagePreview";
import Alert from "@/components/Alert";
import "@/styles/form.css";

export default function EditarInmueble() {
    const searchParams = useSearchParams();
    const idInmueble = searchParams.get("id");
    const router = useRouter();

    const [regiones, setRegiones] = useState([])
    const [error, SetError] = useState("");
    const [alerta, setAlerta] = useState(false);

    const [inmueble, setInmueble] = useState({
        id_inmueble: "",
        tipo_inmueble: "",
        modalidad: "",
        nombre: "",
        propietario: "",
        descripcion: "",
        num_habitaciones: 0,
        num_banios: 0,
        estado: "disponible"
    });
    const [numHabArriendo, setNumHabArriendo] = useState(0);

    // Dirección
    const [direccion, setDireccion] = useState({
        id_direccion: "",
        calle: "",
        numero: "",
        ciudad: "",
        region: "",
        adicional:""
    });

    // Contacto
    const [contacto, setContacto] = useState({
        origen_contacto: "arrendador",
        telefono: "",
        correo: ""
    });

    //imagenes
    const [imgPortada, setImgPortada] = useState(null);
    const [imgPortadaOg, setImgPortadaOg] = useState(null);
    const [imgGaleria, setImgGaleria] = useState(null);
    const [nuevasImgGaleria, setNuevasImgGaleria] = useState(null);

    const handlNuevasImgInmueble = useCallback((files) => {
        setNuevasImgGaleria(files);
    }, []);

    useEffect(() => {
        async function fetchRegiones() {
            const result = await fetch("http://localhost:3000/api/data/regions");
            const data = await result.json();
        setRegiones(data);
        }
        async function fetchInmueble(id){
            const result = await fetch(`http://localhost:3000/api/edit/property-get?id=${id}`);
            const data = await result.json();
            setInmueble({
                id_inmueble: data.ID_INMUEBLE,
                tipo_inmueble: data.TIPO_INMUEBLE,
                modalidad: data.MODALIDAD,
                nombre: data.NOMBRE,
                propietario: data.PROPIETARIO,
                descripcion: data.DESCRIPCION,
                num_habitaciones: data.NUM_HABITACIONES,
                num_banios: data.NUM_BANIOS,
                estado: data.ESTADO
            });

            setNumHabArriendo(data.NUM_HABITACIONES_ARRIENDO);

            setDireccion({
                id_direccion: data.ID_DIRECCION,
                calle: data.CALLE,
                numero: data.NUMERO,
                ciudad: data.CIUDAD,
                region: data.ID_REGION,
                adicional: data.DIRECCION_ADICIONAL
            });

            setContacto({
                origen_contacto: data.ORIGEN_CONTACTO,
                telefono: data.TELEFONO_CONTACTO,
                correo: data.CORREO_CONTACTO
            })

            setImgPortadaOg(data.IMAGENES.find(img => img.ORDEN_IMAGEN == 0)?.NOMBRE_IMAGEN);
            setImgGaleria(data.IMAGENES.filter(img => img.ORDEN_IMAGEN !== 0).map(img => img.NOMBRE_IMAGEN));
        }
        fetchRegiones();
        fetchInmueble(idInmueble);
    }, []);

    async function eliminarInmueble() {
        const response = await fetch(`/api/delete/property?id=${idInmueble}`, {method: "DELETE"});
        if (response.ok){
        window.location.replace('/my-properties');
        }
        setAlerta(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        //Verificar datos de los campos
        if (!inmueble.tipo_inmueble  || !inmueble.nombre){
            SetError("Campos del inmueble obligatorios no pueden estar vacíos");
            return null;
        }
        if (inmueble.num_habitaciones < numHabArriendo){
            SetError("Habitaciones del inmueble no pueden ser menor a las habitaciones en arriendo");
            return null;
        }
        if (!direccion.calle || !direccion.numero  || !direccion.region ){
            SetError("Campos de direccion obligatorios no pueden estar vacíos");
            return null;
        }
        if (contacto.origen_contacto == "arriendo"){
            if (!contacto.telefono ){
                SetError("Campos de contacto obligatorios no pueden estar vacíos");
                return null;
            }
        }
        if(!imgPortadaOg && !imgPortada){
            SetError("Inmueble debe tener una imagen de portada");
            return null;
        }

        const formData = new FormData();

        formData.append("inmueble", JSON.stringify(inmueble));
        formData.append("direccion", JSON.stringify(direccion));
        formData.append("contacto", JSON.stringify(contacto));

        if (!imgPortadaOg) {
            formData.append("imgPortada", imgPortada);
        }
        if (imgGaleria) {
            formData.append("imgGaleria", JSON.stringify(imgGaleria));
        }
        if (nuevasImgGaleria){
            nuevasImgGaleria.forEach((file) => {
                formData.append("nuevasImgGaleria", file);
            });
        } else {
            formData.append("nuevasImgGaleria", []);
        }

        const res = await fetch(`/api/edit/property-post`, {
            method: "POST",
            body: formData
        });

        const resultado = await res.json();
        alert("Arriendo actualizado con exito");
    }

    return (
        <div>
            <Header/>
            <div style={{width:'50vw'}} className="content">
            <h2 style={{justifySelf:'center'}}>Editar Inmueble</h2>

            <div style={{width:'100%', background:'lightgrey', borderRadius:'0.5rem', padding:'0.75rem 1rem', margin:'1rem 0rem'}}>
                {inmueble.estado === "disponible" ? "El inmueble no cuenta con un arriendo activo" :
                "El inmueble posee un arriendo activo"}
            </div>

            {/* Datos del inmueble*/}


            <h3>Datos del inmueble</h3>
            <hr/>
            <h4>Tipo de Inmueble <span style={{ color: "red" }}>*</span> </h4>
            <select
            style={{width:'50%'}}
            value={inmueble.tipo_inmueble}
            onChange={(e) => setInmueble({ ...inmueble, tipo_inmueble: e.target.value })}
            >
            <option value="" disabled>Selecciona Tipo</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            </select>
            <h4>Nombre del inmueble <span style={{ color: "red" }}>*</span> </h4>
            <input value={inmueble.nombre} style={{width:'100%'}} onChange={(e) => setInmueble({...inmueble, nombre: e.target.value})}/>
            <h4>Propietario</h4>
            <input value={inmueble.propietario || ""} style={{width:'100%'}} onChange={(e) => setInmueble({...inmueble, propietario: e.target.value})}/>
            <h4>Descripción</h4>
            <textarea value={inmueble.descripcion || ""} className="descripcion" placeholder="Escribe una descripción del inmueble..." onChange={(e) => setInmueble({...inmueble, descripcion: e.target.value})}/>
            <div style={{display:'flex', flexDirection:'row', gap:'2%', marginBottom:'1%'}}>
            <div style={{display:'flex', flexDirection:'column'}}>
                <h4>Numero de habitaciones <span style={{ color: "red" }}>*</span> </h4>
                <input type="number" min='0' value={inmueble.num_habitaciones}
                onChange={(e) => { (e.target.value < 0) ? setInmueble({...inmueble, num_habitaciones: 0}): setInmueble({...inmueble, num_habitaciones: e.target.value}) }}/>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <h4>Numero de baños <span style={{ color: "red" }}>*</span> </h4>
            <input type="number" min='0' value={inmueble.num_banios}
            onChange={(e) => { (e.target.value < 0) ? setInmueble({...inmueble, num_banios: 0}) : setInmueble({...inmueble, num_banios: e.target.value}) }}/>
            </div>
            </div>
            
            <h3>Dirección </h3>
            <Direccion direccion={direccion} setDireccion={setDireccion} regiones={regiones}/>

            <h3>Contacto</h3>
            <Contacto contacto={contacto} setContacto={setContacto}/>

            <h3>Imagenes</h3>
            <h4>Imagen portada del inmueble</h4>
            { imgPortadaOg ? (
                <ImagePreview imagenes={imgPortadaOg} setImagenes={setImgPortadaOg} multiple={false}/>
            ):(
                <ImageUploader imageOnChanges={(files) => setImgPortada(files[0])}/>
            )}
            <h4>Galeria de imagenes</h4>
            { imgGaleria ? ( <ImagePreview imagenes={imgGaleria} setImagenes={setImgGaleria} multiple={true}/> ):
            (
                <div style={{justifySelf:'center', width:'60%', textAlign:'center', borderRadius:'1vw', background:'#dadadaff', margin:'2%'}}>
                 <span style={{margin:'1%', fontSize:'1vw'}}> No hay imagenes de galeria</span>
                </div>
            )}

            <h4 style={{color:'grey', margin:'1% 0% 0% 0%'}}>añadir nuevas imagenes</h4>
            <ImageUploader imageOnChanges={handlNuevasImgInmueble} multiple={true}/>
            
            <br/>
            <div style={{margin:"1% 0% 2% 0%"}}>
                <span style={{color:'red', fontSize:'1vw'}}>{error}</span>
            </div>

            <Alert message={"¿Desea eliminar inmueble?\nSe eliminara el arriendo asociado"} onAccept={()=>eliminarInmueble()} open={alerta} setOpen={setAlerta}/>

            <div style={{display:'flex'}}>
                <button 
                onClick={handleSubmit}
                style={{ padding: "10px 20px", background: "#00638e", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer"}}
                >
                Guardar Cambios
                </button>
                <button 
                onClick={() => router.push('/my-properties')}
                style={{ padding: "10px 20px", background: "#00638e", color: "white", border: "none", borderRadius: "0.5rem", marginLeft:"1rem", cursor:"pointer" }}
                >
                Cancelar
                </button>
                <button onClick={() => setAlerta(true)}
                    style={{ padding: "10px 20px", background: "red", color: "white", border: "none", borderRadius: "0.5rem", marginLeft:"auto", cursor:"pointer" }}
                >
                    Eliminar Inmueble
                </button>
            </div>
            </div>
        </div>
    );
}