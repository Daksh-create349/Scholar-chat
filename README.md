# Scholar Chat: AI-Powered Research Synthesizer

Scholar Chat is a modern, AI-powered web application designed to accelerate the research process for students, academics, and professionals. It transforms the tedious task of sifting through dense academic literature into an interactive and insightful experience. By integrating powerful generative AI, Scholar Chat helps users not only find relevant papers but also understand their content, identify trends, and even spark new research ideas.

## How It Works

The application is built with a cutting-edge tech stack, including **Next.js**, **React**, **Tailwind CSS**, and **Firebase**. User authentication is handled by Firebase Auth (supporting email/password and Google sign-in), and user-specific data, such as paper collections, is securely stored in Firestore.

The core intelligence of Scholar Chat is powered by **Google's Generative AI** through the **Genkit** framework. A series of server-side AI "flows" handle complex tasks like searching for papers from external APIs (like Semantic Scholar), summarizing text, analyzing trends, and generating novel hypotheses. The frontend is built with **ShadCN UI** components, providing a sleek, responsive, and modern user experience.

## Key Features

Scholar Chat is packed with tools designed to streamline every step of the research workflow:

### 1. **Intelligent Paper Search**
-   **Natural Language Search:** Find academic papers using simple keywords, topics, or questions.
-   **Real-Time Results:** The app fetches up-to-date papers from the Semantic Scholar API, ensuring you have access to the latest research.
-   **Advanced Filtering:** Sort and filter results by relevance, citation count, or publication date to quickly find the most impactful papers.

### 2. **Personalized Collections**
-   **Organize Your Research:** Save any paper to one or more collections to keep your research organized by project, topic, or interest.
-   **Easy Management:** Create, edit, and delete collections with a simple and intuitive interface.

### 3. **AI-Powered Analysis & Insights**
-   **Conversational Assistant:** Chat with an AI assistant that can answer questions and provide summarized, up-to-date information about any research field.
-   **Trend Analysis:** Paste multiple paper abstracts to identify and visualize emerging trends, key concepts, and research hotspots with an auto-generated chart.
-   **Hypothesis Generator:** Input a topic or abstract, and the AI will analyze it to suggest novel research questions and testable hypotheses, helping you find unexplored avenues for your own work.

### 4. **Content Creation Tools**
-   **"Paper-to-Presentation" PDF Exporter:** Automatically generate a presentation-ready PDF summary from any research paper. The PDF includes slides for the title, key findings, implications, and the original abstract, providing a fantastic starting point for your presentations.

### 5. **Modern User Experience**
-   **Interactive Dashboard:** A central hub to quickly access your collections and start new searches.
-   **Light & Dark Mode:** Choose your preferred theme for comfortable reading and research, day or night.
-   **Secure Authentication:** Secure user accounts with options for email/password and Google sign-in.
-   **Responsive Design:** Access the full power of Scholar Chat on any device, from desktop to mobile.

