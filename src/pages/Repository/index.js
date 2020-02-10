import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loading, Owner, IssuesList } from './style';
import Container from '../../components/Container';

class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
    };

    async componentDidMount() {
        const { match } = this.props;
        const repoName = decodeURIComponent(match.params.repository);
        // Quando precisar executar duas promise ao mesmo tempo
        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
    }

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading>Carregando</Loading>;
        }
        return (
            <Container>
                <Owner>
                    <Link to="/">voltar para os repositorios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <IssuesList>
                    {issues.map((issues) => (
                        <li key={String(issues.id)}>
                            <img
                                src={issues.user.avatar_url}
                                alt={issues.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issues.html_url}>{issues.title}</a>
                                </strong>
                                <p>{issues.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssuesList>
            </Container>
        );
    }
}

export default Repository;
