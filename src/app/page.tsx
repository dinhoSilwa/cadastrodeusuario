
"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'; // Importa yupResolver do react-hook-form
import * as yup from "yup";
import { json } from "stream/consumers";

//firebase imports

import {databasefirebase} from './firebaseConfig'
import { collection, addDoc } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
  selected: string;
}

const Home = () => {
  const userRegisterSchema = yup.object().shape({
    name: yup
      .string()
      .required("Este campo não pode está vazio")
      .min(3, "O nome precisa ter 3 ou mais caracteres")
      .max(8, "Seu nome não pode ter mais de 8 caracteres"),

    email: yup.string().required("O email é obrigatório"),
    selected: yup.string().required("Escolha algum país(es)"),
  });

  const [output, setOutput] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(userRegisterSchema),
  });


  const databaseconnect = async (data : FormData) => {
    try {
      const docRef = await addDoc(
        collection(databasefirebase, 'menssages'),
        {
          name: data.name,
          email: data.email,
          selected: data.selected
        }
      );
      return true; // Adicionado para indicar sucesso
    } catch (error) {
      console.error("erro add doc", error);
      return false;
    }
  };
  

  const onSubmit = async (data : FormData) => {
    try {
      const success = await databaseconnect(data); // Chama a função assíncrona databaseconnect
      if (success) {
        setOutput("Dados enviados com sucesso!");
      } else {
        setOutput("Erro ao enviar os dados. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("erro add doc", error);
      setOutput("Erro ao enviar os dados. Por favor, tente novamente.");
    }
  };
  

  return (
    <div className="bg-zinc-900 h-screen grid place-content-center">
      <div className="info">{output}</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[300px] bg-zinc-800 rounded-md p-8 flex flex-col space-y-2 text-zinc-400
        bg-filter"
      >
        <label htmlFor="nome">Nome</label>
        <input
          className="focus:ring focus:ring-emerald-500 bg-zinc-900 p-2 rounded-md"
          type="text"
          id="nome"
          placeholder="Digite o seu nome"
          {...register("name")}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <label htmlFor="email">Email</label>
        <input
          className="focus:ring focus:ring-emerald-500 bg-zinc-900 p-2 rounded-md"
          type="email"
          id="email"
          placeholder="Digite o seu Email"
          {...register("email")}
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}

        <div>
          <label className="flex gap-2 mb-2">
            <input
              className="bg-zinc-900 p-2 rounded-md"
              type="radio"
              value="brasil"
              {...register("selected")}
            />
            Brasil
          </label>
        </div>
        <div>
          <label className="flex gap-2 mb-2">
            <input
              className="bg-zinc-900 p-2 rounded-md"
              type="radio"
              value="venezuela"
              {...register("selected")}
            />
            Venezuela
          </label>
        </div>
        <div>
          <label className="flex gap-2 mb-2">
            <input
              className="bg-zinc-900 p-2 rounded-md"
              type="radio"
              value="Italia"
              {...register("selected")}
            />
            Itália
          </label>
        </div>
        <div>
          <label className="flex gap-2 mb-2">
            <input
              className="bg-zinc-900 p-2 rounded-md"
              type="radio"
              value="Portugal"
              {...register("selected")}
            />
            Portugal
          </label>
          {errors.selected && <span className="text-red-600">{errors.selected.message}</span>}
        </div>

        <button className="bg-emerald-600 text-white p-2 rounded-md">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Home;
