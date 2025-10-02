import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Card, Title } from "@atoms";
import "./Register.scss";
import { setUser, setLoading, setAuthenticated, setError, clearError } from '@slices/authSlice';
import { authService } from '@services';

/**
 * Register - Page d'inscription
 */
const Register = () => {
  const { t } = useTranslation(["common", "pages"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const error = useSelector(state => state.auth.error);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = t("common:validation.required");
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t("common:validation.required");
    }

    if (!formData.email) {
      errors.email = t("common:validation.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("common:validation.invalidEmail");
    }

    if (!formData.password) {
      errors.password = t("common:validation.required");
    } else if (formData.password.length < 6) {
      errors.password = t("common:validation.passwordTooShort");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t("common:validation.passwordMismatch");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur de ce champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validateForm()) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const { confirmPassword, ...registrationData } = formData;
      const userData = await authService.register(registrationData);
      if (userData) {
        dispatch(setUser(userData));
        dispatch(setAuthenticated(true));
        navigate(userData.role === "admin" ? "/admin" : "/");
      } else {
        dispatch(setError("Erreur lors de l'inscription"));
      }
    } catch (err) {
      dispatch(setError(err.message || "Erreur serveur"));
      console.error("Erreur d'inscription:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <div className="register-header">
            <Title level={1} className="register-title">
              {t("pages:register.title")}
            </Title>
            <p className="register-subtitle">{t("pages:register.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <Input
                  type="text"
                  name="firstName"
                  placeholder={t("common:form.firstName")}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`register-input ${
                    formErrors.firstName ? "error" : ""
                  }`}
                />
                {formErrors.firstName && (
                  <span className="field-error">{formErrors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <Input
                  type="text"
                  name="lastName"
                  placeholder={t("common:form.lastName")}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={`register-input ${
                    formErrors.lastName ? "error" : ""
                  }`}
                />
                {formErrors.lastName && (
                  <span className="field-error">{formErrors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder={t("common:form.email")}
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`register-input ${formErrors.email ? "error" : ""}`}
              />
              {formErrors.email && (
                <span className="field-error">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("common:form.password")}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`register-input ${
                    formErrors.password ? "error" : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formErrors.password && (
                <span className="field-error">{formErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder={t("common:form.confirmPassword")}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`register-input ${
                    formErrors.confirmPassword ? "error" : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <span className="field-error">
                  {formErrors.confirmPassword}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading
                ? t("common:loading")
                : t("pages:register.registerButton")}
            </Button>

            <div className="register-links">
              <Link to="/login" className="login-link">
                {t("pages:register.hasAccount")}
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
