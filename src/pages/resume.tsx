import * as moment from 'moment';
import * as React from 'react';
import Helmet from 'react-helmet';

import * as styles from './index.module.css';
import * as brandOutline from '../assets/brand/outline.svg';

interface ResumePageProps {
    data: {
        site: {
            meta: siteMetadata_2;
        };
        allWorkJson: {
            jobs: {
                work: WorkJson;
            }[];
        };
        allProjectsJson: {
            projects: {
                project: ProjectsJson;
            }[];
        };
        allPortfolioJson: {
            edges: {
                education: PortfolioJson;
            }[];
        };
        allSkillsJson: {
            edges: {
                skill: SkillsJson;
            }[];
        };
    };
}

export const getDatesString = (start: string, end?: string, noEndMeansActive?: boolean) => {
    const dateFormat = 'MMMM YYYY';
    const startDate = moment(start).format(dateFormat);
    if (end) {
        const endDate = moment(end).format(dateFormat);
        return `${startDate} to ${endDate}`;
    } else if (noEndMeansActive) {
        return `${startDate} to Present`;
    }
    return startDate;
};

interface ResumeSectionProps {
    heading: string;
    children?: any;
}

const ResumeSection = (props: ResumeSectionProps) =>
    <section className={styles.resumeSection}>
        <h2 className={styles.resumeSectionHeading}>{props.heading}</h2>
        {props.children}
    </section>;

interface ResumeItemProps {
    item: WorkJson & ProjectsJson;
}

const ResumeItem = ({ item }: ResumeItemProps) => {
    const isProject = !!item.type;
    let heading;
    let description;
    if (isProject) {
        heading = `${item.title} (${getDatesString(item.start, item.end, false)})`;
        description = `${item.longDescription || item.description} (${item.type})`;
    } else {
        heading = `${item.title}, ${item.employer} – ${getDatesString(item.start, item.end, true)}`;
        description = `${item.longDescription || item.description}`;
    }
    return (
        <div>
            <h3 className={styles.resumeProjectHeading}>
                <a href={item.link}>{heading}</a>
            </h3>
            <p className={styles.resumeProjectDescription}>{description}</p>
        </div>
    );
}

export default ({ data }: ResumePageProps) =>
    <div className={styles.resume}>
        <Helmet title="Resume" />
        <header>
            <span>
                <h1 className={styles.resumeHeaderHeading}>Aaron Sky</h1>
            </span>
            <span>
                <h2 className={styles.resumeHeaderSubheading}>
                    <a href={`mailto:${data.site.meta.email}`}>{data.site.meta.email}</a> •&nbsp;
                    <a href={data.site.meta.site}>{data.site.meta.site.replace(/(^\w+:|^)\/\//, '')}</a> •&nbsp;
                    <a href={data.site.meta.github}>{data.site.meta.github.replace(/(^\w+:|^)\/\//, '')}</a>
                </h2>
            </span>
            <hr className={styles.resumeHeaderLine} />
        </header>
        <ResumeSection heading="Experience">
            {data.allWorkJson.jobs.map(({ work }) => <ResumeItem item={work} />)}
        </ResumeSection>
        <ResumeSection heading="Projects">
            {data.allProjectsJson.projects.map(({ project }) => <ResumeItem item={project} />)}
        </ResumeSection>
        <ResumeSection heading="Skills">
            <h4 className={styles.resumeProjectHeading}>
                Selected by relevance and order of current confidence
            </h4>
            <div className={styles.resumeProjectDescription}>
                {
                    data.allSkillsJson.edges.map(({ skill }) =>
                        <span className={styles.resumeSkillItem} key={skill.tool}>
                            <strong>{skill.tool}</strong>
                            <em>{`(${skill.time})`}</em>
                        </span>
                    )
                }
            </div>
        </ResumeSection>
        <ResumeSection heading="Education">
            <p className={styles.resumeProjectDescription}>{`${data.allPortfolioJson.edges[0].education.school}, ${data.allPortfolioJson.edges[0].education.location}`}</p>
            <p className={styles.resumeProjectDescription}>{`${data.allPortfolioJson.edges[0].education.degree}, ${data.allPortfolioJson.edges[0].education.date}`}</p>
        </ResumeSection>
        <footer className={styles.resumeFooter}>
            <hr className={styles.resumeFooterLine} />
            <img className={styles.resumeFooterLogo} src={brandOutline} alt={`${data.site.meta.author} brand logo`} />
        </footer>
    </div>;

export const query = graphql`
    fragment Work on WorkJson {
        id
        title
        employer
        image
        link
        start
        end
        description
        longDescription
        languages
    }

    fragment Project on ProjectsJson {
        id
        title
        image
        link
        type
        start
        end
        roles
        languages
        longDescription
    }

    fragment Education on PortfolioJson {
        image
        school
        location
        degree
        date
    }

    query ResumeQuery {
        site {
            meta: siteMetadata {
                author
                site
                email
                github
            }
        }
        allWorkJson(
            sort: { fields: [start], order: DESC },
            filter: { ignore: { eq: false } resume: { eq: true } }
        ) {
            jobs: edges {
                work: node {
                    ...Work
                }
            }
        }
        allProjectsJson(
            sort: { fields: [start], order: DESC },
            filter: { ignore: { eq: false } resume: { eq: true } }
        ) {
            projects: edges {
                project: node {
                    ...Project
                }
            }
        }
        allPortfolioJson {
            edges {
                education: node {
                    ...Education
                }
            }
        }
        allSkillsJson {
            edges {
                skill: node {
                    time
                    tool
                }
            }
        }
    }
`;
