import styles from "./project.module.css";

import { useParams } from "react-router-dom";

import Message from "../layout/message";

import { useState, useEffect } from "react";

import Loading from "../layout/loading";

import Container from "../layout/container";

import ProjectForm from "../project/ProjectForm";

import ServiceForm from "../services/serviceForm";

import { v4 as uuidv4 } from "uuid";

import ServiceCard from "../services/serviceCard";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProject(data);
          setServices(data.services);
        })
        .catch((err) => console.log);
    }, 600);
  }, [id]);

  function editPost(project) {
    setMessage("");

    //budget validation
    if (project.budget < project.cost) {
      setMessage("o orçamento não pode ser menor que o do projeto");
      setType("error");
      return false;
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto atualizado");
        setType("success");
      })
      .catch((err) => console.log(err));
  }

  //metodos
  function createService(project) {
    setMessage("");
    //last service
    const lastService = project.services[project.services.length - 1];

    lastService.id = uuidv4();

    const lastServiceCost = lastService.cost;

    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

    //maximus value vaçidation

    if (newCost > parseFloat(project.budget)) {
      setMessage("orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      project.service.pop();
      return false;
    }

    //add service cost to project total cost
    project.cost = newCost;

    //update project
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setShowProjectForm(false);
      })
      .catch((err) => console.log(err));
  }

  function removeService(id, cost) {
    const serviceUpdate = project.services.filter(
      (service) => service.id !== id
    );

    const projectUpdate = project;

    projectUpdate.services = serviceUpdate;
    projectUpdate.cost = parseFloat(projectUpdate.cost) - parseFloat(cost);

    fetch(`http://localhost:5000/projects/${projectUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdate),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdate);
        setServices(serviceUpdate);
        setMessage("serviço removido com sucesso");
      })
      .catch((err) => console.log(err));
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar projeto" : "fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span> {project.category.name}
                  </p>
                  <p>
                    <span>Total de Orçamento:</span> R${project.budget}
                  </p>
                  <p>
                    <span>total utilizado:</span> R${project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btntext="concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>adiicione um serviço</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "adicionar serviço" : "fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="adicionar serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>não há serviços cadastrados</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
