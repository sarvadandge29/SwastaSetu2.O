"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SelfDiagnosis: React.FC = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    duration: "",
    symptoms: "",
    allergies: "",
    medications: "",
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Based on the following information, provide a possible diagnosis and advice:
- Age: ${formData.age}
- Gender: ${formData.gender}
- Duration of Symptoms: ${formData.duration}
- Symptoms: ${formData.symptoms}
- Allergies: ${formData.allergies}
- Medications: ${formData.medications}

Please provide a detailed response.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setResult(text);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      setResult("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">Self Diagnosis</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration of Symptoms (e.g., 2 days, 1 week)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Known Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Medications</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Diagnosis Result</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result}</p>
            <p className="mt-4 font-medium text-red-600 dark:text-red-400">
              Please consult a doctor for further evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfDiagnosis;