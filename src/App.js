import axios from "axios";
import { useState, useEffect } from "react";

import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";

const App = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [departement, setDepartement] = useState([]);
  const [isUpdate, setIsUpdate] = useState({ status: false, id: 0 });
  const [jabatan, setJabatan] = useState([]);
  const [formJabatan, setFormJabatan] = useState({
    id_departement: "",
    nama_jabatan: "",
  });
  const [formDepartement, setFormDepartement] = useState({
    nama_departement: "",
  });
  const [state, setState] = useState({
    name: "",
    usia: "",
    gender: "",
    tanggal_lahir: "",
    alamat: "",
    departement: "",
    jabatan: "",
  });

  const getDataKaryawan = async () => {
    try {
      const response = await axios("http://localhost:3010/api/v1/karyawan");
      const karyawan = response.data.data;
      setKaryawan(karyawan);
    } catch (err) {
      console.log(err);
    }
  };

  const getDepartement = async () => {
    try {
      const response = await axios("http://localhost:3010/api/v1/departements");
      const departement = response.data.data;

      setDepartement(departement);
    } catch (err) {
      console.log(err);
    }
  };

  const getJabatan = async () => {
    try {
      const response = await axios("http://localhost:3010/api/v1/jabatan");
      const jabatan = response.data.data;
      setJabatan(jabatan);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    setState({ ...state, [name]: value });
  };

  const handleGander = (gender) => {
    switch (gender) {
      case "L":
        return "Laki-Laki";
      case "P":
        return "Perempuan";
      default:
        return new Error("Gender invalid");
    }
  };

  const sortJabatanByDepartement = (data) => {
    const result = data.filter(
      (data) => data.id_departement == state.departement
    );

    return result;
  };

  const postKaryawan = async () => {
    try {
      const { name, usia, gender, tanggal_lahir, alamat, jabatan } = state;
      const response = await axios.post(
        "http://localhost:3010/api/v1/karyawan",
        {
          name,
          age: parseInt(usia),
          gender,
          tanggal_lahir,
          alamat,
          id_jabatan: parseInt(jabatan),
        }
      );
      if (response) {
        alert("Berhasil Menambahkan karyawan");
        getDataKaryawan();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormDepartement = (e) => {
    setFormDepartement({ ...formDepartement, [e.target.name]: e.target.value });
  };

  const createDepartement = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/v1/departement",
        {
          nama_departement: formDepartement.nama_departement,
        }
      );
      if (response) {
        alert("Berhasil menambahkan departement");
        getDepartement();
      }

      getDataKaryawan();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormJabatan = (e) => {
    setFormJabatan({ ...formJabatan, [e.target.name]: e.target.value });
  };

  const createJabatan = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/v1/jabatan",
        {
          id_departement: parseInt(formJabatan.id_departement),
          nama_jabatan: formJabatan.nama_jabatan,
        }
      );
      if (response) {
        alert("Berhasil menambahkan jabatan");
        getDepartement();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteKaryawan = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/api/v1/karyawan/${id}`);
      getDataKaryawan();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteKaryawan = (id, name) => {
    if (window.confirm(`Anda yakin ingin menghapus karyawan ${name}`)) {
      deleteKaryawan(id);
    }
  };

  const getKaryawanById = async (id) => {
    try {
      const response = await axios(
        `http://localhost:3010/api/v1/karyawan/${id}`
      );
      const karyawan = await response.data.data;
      const {
        name,
        age,
        alamat,
        gender,
        tanggal_lahir,
        jabatan: {
          id: id_jabatan,
          departement: { id: id_departement },
        },
      } = karyawan;
      console.log(karyawan);
      if (karyawan) {
        setState({
          ...state,
          name,
          usia: age,
          alamat,
          gender,
          tanggal_lahir,
          departement: id_departement?.toString(),
          jabatan: id_jabatan?.toString(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateKaryawan = async (id) => {
    try {
      const { name, usia, gender, tanggal_lahir, alamat, jabatan } = state;
      await axios.patch(`http://localhost:3010/api/v1/karyawan/${id}`, {
        name,
        age: parseInt(usia),
        gender,
        tanggal_lahir,
        alamat,
        id_jabatan: parseInt(jabatan),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataKaryawan();
    getDepartement();
    getJabatan();
  }, []);

  return (
    <Container>
      {/* AWAL FORM JABATAN */}
      <h1 className="mt-5">Tambah Jabatan</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          createJabatan();
          getDepartement();
        }}
      >
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Departement
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="id_departement"
              onChange={(e) => handleFormJabatan(e)}
            >
              <option value="">Choose :</option>
              {departement.map((departement) => {
                return (
                  <option value={departement.id}>
                    {departement.nama_departement}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <fieldset disabled={formJabatan.id_departement != "" ? false : true}>
          <Form.Group as={Row} className="mt-5">
            <Form.Label column sm={2}>
              Nama Jabatan
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Nama Jabatan"
                name="nama_jabatan"
                value={formJabatan.nama_jabatan}
                onChange={(e) => handleFormJabatan(e)}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <Button className="float-right " variant="primary" type="submit">
          Tambah
        </Button>
      </Form>
      {/* AKHIR FORM JABATAN */}

      {/* AWAL FORM DEPARTEMENT */}
      <h1 className="mt-5">Tambah Departement</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          createDepartement();
        }}
      >
        <Form.Group as={Row} className="mt-5">
          <Form.Label column sm={2}>
            Nama Departement
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Nama Departement"
              name="nama_departement"
              value={formDepartement.nama_departement}
              onChange={(e) => handleFormDepartement(e)}
            />
          </Col>
        </Form.Group>
        <Button className="float-right " variant="primary" type="submit">
          Tambah
        </Button>
      </Form>
      {/* AKHIR FORM DEPARTEMENT */}

      {/* AWAL FORM KARYAWAN */}
      <h1 className="mt-5">Tambah Karyawan</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (isUpdate) {
            updateKaryawan(isUpdate.id);
          } else {
            postKaryawan();
          }
          getDataKaryawan();
        }}
      >
        <Form.Group as={Row} className="mt-5">
          <Form.Label column sm={2}>
            Nama
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Nama"
              name="name"
              value={state.name}
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Usia
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Usia"
              name="usia"
              value={state.usia}
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            Gender
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="Laki-Laki"
              name="gender"
              id="gender1"
              value="L"
              onChange={(e) => handleChange(e)}
            />
            <Form.Check
              type="radio"
              label="Perempuan"
              name="gender"
              value="P"
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Tanggal Lahir
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="tanggal_lahir"
              value={state.tanggal_lahir}
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Alamat
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              placeholder="Alamat"
              name="alamat"
              value={state.alamat}
              onChange={(e) => handleChange(e)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Departement
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="departement"
              onChange={(e) => handleChange(e)}
            >
              <option value="">Choose :</option>
              {departement.map((departement) => {
                return (
                  <option value={departement.id}>
                    {departement.nama_departement}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <fieldset disabled={state.departement != "" ? false : true}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Jabatan
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as="select"
                name="jabatan"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Choose :</option>
                {sortJabatanByDepartement(jabatan).map((item) => {
                  return <option value={item.id}>{item.nama_jabatan}</option>;
                })}
              </Form.Control>
            </Col>
          </Form.Group>
        </fieldset>

        <Button className="float-right " variant="primary" type="submit">
          {isUpdate.status ? "Update" : "Tambah"}
        </Button>
      </Form>

      {/* AKHIR FORM KARYAWAN */}

      {/* AWAL TABLE */}
      <h1 className="mt-5">List Karyawan</h1>
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Usia</th>
            <th>Gender</th>
            <th>Tanggal Lahir</th>
            <th>Alamat</th>
            <th>Departement</th>
            <th>Jabatan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {karyawan.map((karyawan, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{karyawan.name}</td>
                <td>{karyawan.age}</td>
                <td>{handleGander(karyawan.gender)}</td>
                <td>{karyawan.tanggal_lahir}</td>
                <td>{karyawan.alamat}</td>
                <td>{karyawan.jabatan.departement.nama_departement}</td>
                <td>{karyawan.jabatan.nama_jabatan}</td>
                <td>
                  <Row>
                    <Col>
                      <Button
                        variant="info"
                        onClick={() => {
                          getKaryawanById(karyawan.id);
                          setIsUpdate({
                            ...isUpdate,
                            status: true,
                            id: karyawan.id,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDeleteKaryawan(karyawan.id, karyawan.name)
                        }
                      >
                        Hapus
                      </Button>
                    </Col>
                  </Row>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
