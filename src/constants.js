const getEnv = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      API_URL: "https://github-list-api.herokuapp.com",
      GITHUB_STAR_PROJECT: "https://github.com/github-list/github-list.github.io",
    }
  } else {
    return {
      API_URL: "http://localhost:8080",
      GITHUB_STAR_PROJECT: "https://github.com/github-list/github-list.github.io",
    }
  }
}

export default getEnv;