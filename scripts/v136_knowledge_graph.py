#!/usr/bin/env python3
"""
V136 AI Email Knowledge Graph
==============================

A production-quality system for building and querying a living knowledge graph
from email communications. Tracks people, topics, projects, and companies as
nodes with rich relationship edges. Provides expertise mapping, organizational
network analysis, trend detection, collaboration discovery, knowledge gap
identification, and a powerful query interface.

Features:
    - Node types: Person, Topic, Project, Company
    - Edge types: communicates_with, discusses, owns, manages, expert_in
    - Expertise mapping from email content analysis
    - Network analysis: degree centrality, betweenness, clustering coefficient
    - Topic trend detection over time windows
    - Collaboration pattern discovery
    - Knowledge gap identification
    - Relationship strength scoring (frequency, recency, depth)
    - Graph query interface (find experts, path queries, subgraph extraction)
    - Reply-all enforcement for knowledge-sharing emails

Author: V136 Systems
Version: 1.0.0
"""

from __future__ import annotations

import math
import re
import uuid
import hashlib
import logging
from collections import defaultdict, Counter
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import (
    Any,
    Dict,
    FrozenSet,
    Iterable,
    List,
    Optional,
    Set,
    Tuple,
    Union,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("v136_knowledge_graph")

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class NodeType(Enum):
    """Types of nodes in the knowledge graph."""
    PERSON = auto()
    TOPIC = auto()
    PROJECT = auto()
    COMPANY = auto()


class EdgeType(Enum):
    """Types of edges (relationships) in the knowledge graph."""
    COMMUNICATES_WITH = "communicates_with"
    DISCUSSES = "discusses"
    OWNS = "owns"
    MANAGES = "manages"
    EXPERT_IN = "expert_in"
    WORKS_ON = "works_on"
    BELONGS_TO = "belongs_to"
    MENTIONS = "mentions"


class EmailPriority(Enum):
    """Priority levels for emails."""
    LOW = auto()
    NORMAL = auto()
    HIGH = auto()
    URGENT = auto()


class TrendDirection(Enum):
    """Direction of a topic trend."""
    RISING = auto()
    STABLE = auto()
    DECLINING = auto()
    EMERGING = auto()
    FADING = auto()


class KnowledgeGapSeverity(Enum):
    """Severity of an identified knowledge gap."""
    LOW = auto()
    MEDIUM = auto()
    HIGH = auto()
    CRITICAL = auto()


class CollaborationPattern(Enum):
    """Types of collaboration patterns discovered."""
    HUB_AND_SPOKE = auto()
    TIGHT_CLUSTER = auto()
    BRIDGE_CONNECTOR = auto()
    SILO = auto()
    CHAIN = auto()
    STAR = auto()


# ---------------------------------------------------------------------------
# Data Classes
# ---------------------------------------------------------------------------


@dataclass
class GraphNode:
    """A node in the knowledge graph."""
    node_id: str
    node_type: NodeType
    label: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    attributes: Dict[str, Any] = field(default_factory=dict)

    def __hash__(self) -> int:
        return hash(self.node_id)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, GraphNode):
            return NotImplemented
        return self.node_id == other.node_id


@dataclass
class GraphEdge:
    """An edge (relationship) in the knowledge graph."""
    edge_id: str
    edge_type: EdgeType
    source_id: str
    target_id: str
    weight: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    interactions: int = 0
    last_interaction: Optional[datetime] = None

    def __hash__(self) -> int:
        return hash(self.edge_id)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, GraphEdge):
            return NotImplemented
        return self.edge_id == other.edge_id


@dataclass
class EmailMessage:
    """Represents an email message for graph ingestion."""
    message_id: str
    sender: str
    recipients: List[str]
    cc: List[str] = field(default_factory=list)
    bcc: List[str] = field(default_factory=list)
    subject: str = ""
    body: str = ""
    timestamp: datetime = field(default_factory=datetime.utcnow)
    priority: EmailPriority = EmailPriority.NORMAL
    is_reply: bool = False
    in_reply_to: Optional[str] = None
    thread_id: Optional[str] = None
    attachments: List[str] = field(default_factory=list)
    is_knowledge_sharing: bool = False

    @property
    def all_participants(self) -> List[str]:
        """All participants in this email."""
        participants = [self.sender] + self.recipients + self.cc + self.bcc
        return list(dict.fromkeys(participants))


@dataclass
class ExpertiseScore:
    """Expertise score for a person on a topic."""
    person_id: str
    topic: str
    score: float
    evidence_count: int = 0
    last_demonstrated: Optional[datetime] = None
    confidence: float = 0.0
    sources: List[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.score = max(0.0, min(1.0, self.score))
        self.confidence = max(0.0, min(1.0, self.confidence))


@dataclass
class NetworkMetrics:
    """Network analysis metrics for a node."""
    node_id: str
    degree_centrality: float = 0.0
    betweenness_centrality: float = 0.0
    clustering_coefficient: float = 0.0
    closeness_centrality: float = 0.0
    pagerank: float = 0.0
    eigenvector_centrality: float = 0.0


@dataclass
class TopicTrend:
    """Trend information for a topic over time."""
    topic: str
    direction: TrendDirection
    current_frequency: float = 0.0
    previous_frequency: float = 0.0
    change_rate: float = 0.0
    peak_date: Optional[datetime] = None
    involved_people: List[str] = field(default_factory=list)
    window_start: Optional[datetime] = None
    window_end: Optional[datetime] = None


@dataclass
class KnowledgeGap:
    """Identified knowledge gap in the organization."""
    gap_id: str
    topic: str
    severity: KnowledgeGapSeverity
    description: str
    affected_people: List[str] = field(default_factory=list)
    recommended_experts: List[str] = field(default_factory=list)
    suggested_actions: List[str] = field(default_factory=list)


@dataclass
class RelationshipStrength:
    """Strength score for a relationship between two entities."""
    source_id: str
    target_id: str
    overall_score: float = 0.0
    frequency_score: float = 0.0
    recency_score: float = 0.0
    depth_score: float = 0.0
    diversity_score: float = 0.0
    longevity_score: float = 0.0


@dataclass
class QueryResult:
    """Result from a graph query."""
    query_type: str
    results: List[Any] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    execution_time_ms: float = 0.0


@dataclass
class CollaborationCluster:
    """A discovered collaboration cluster."""
    cluster_id: str
    pattern: CollaborationPattern
    members: List[str] = field(default_factory=list)
    strength: float = 0.0
    primary_topics: List[str] = field(default_factory=list)
    description: str = ""


@dataclass
class ReplyAllEnforcement:
    """Reply-all enforcement decision for knowledge-sharing emails."""
    email_id: str
    should_reply_all: bool = False
    reason: str = ""
    missing_recipients: List[str] = field(default_factory=list)
    knowledge_value_score: float = 0.0
    recommended_action: str = ""


# ---------------------------------------------------------------------------
# Knowledge Graph Core
# ---------------------------------------------------------------------------


class KnowledgeGraph:
    """
    Core knowledge graph engine supporting nodes, edges, and rich queries.
    Implements adjacency list storage with indexing for fast lookups.
    """

    def __init__(self) -> None:
        self._nodes: Dict[str, GraphNode] = {}
        self._edges: Dict[str, GraphEdge] = {}
        self._adjacency: Dict[str, Set[str]] = defaultdict(set)
        self._reverse_adjacency: Dict[str, Set[str]] = defaultdict(set)
        self._node_edges: Dict[str, Set[str]] = defaultdict(set)
        self._type_index: Dict[NodeType, Set[str]] = defaultdict(set)
        self._edge_type_index: Dict[EdgeType, Set[str]] = defaultdict(set)
        self._label_index: Dict[str, Set[str]] = defaultdict(set)

    # -- Node Operations --

    def add_node(self, node: GraphNode) -> GraphNode:
        """Add a node to the graph."""
        self._nodes[node.node_id] = node
        self._type_index[node.node_type].add(node.node_id)
        self._label_index[node.label.lower()].add(node.node_id)
        logger.debug("Added node: %s (%s)", node.label, node.node_type.name)
        return node

    def get_node(self, node_id: str) -> Optional[GraphNode]:
        """Retrieve a node by ID."""
        return self._nodes.get(node_id)

    def find_nodes_by_type(self, node_type: NodeType) -> List[GraphNode]:
        """Find all nodes of a given type."""
        return [self._nodes[nid] for nid in self._type_index[node_type] if nid in self._nodes]

    def find_nodes_by_label(self, label: str) -> List[GraphNode]:
        """Find nodes matching a label (case-insensitive)."""
        label_lower = label.lower()
        results = []
        for lbl, nids in self._label_index.items():
            if label_lower in lbl:
                results.extend(self._nodes[nid] for nid in nids if nid in self._nodes)
        return results

    def remove_node(self, node_id: str) -> bool:
        """Remove a node and all its edges."""
        if node_id not in self._nodes:
            return False
        node = self._nodes[node_id]
        self._type_index[node.node_type].discard(node_id)
        self._label_index[node.label.lower()].discard(node_id)
        # Remove associated edges
        edges_to_remove = list(self._node_edges.get(node_id, set()))
        for edge_id in edges_to_remove:
            self.remove_edge(edge_id)
        self._adjacency.pop(node_id, None)
        self._reverse_adjacency.pop(node_id, None)
        self._node_edges.pop(node_id, None)
        del self._nodes[node_id]
        return True

    # -- Edge Operations --

    def add_edge(self, edge: GraphEdge) -> GraphEdge:
        """Add an edge to the graph."""
        self._edges[edge.edge_id] = edge
        self._adjacency[edge.source_id].add(edge.target_id)
        self._reverse_adjacency[edge.target_id].add(edge.source_id)
        self._node_edges[edge.source_id].add(edge.edge_id)
        self._node_edges[edge.target_id].add(edge.edge_id)
        self._edge_type_index[edge.edge_type].add(edge.edge_id)
        logger.debug(
            "Added edge: %s -[%s]-> %s",
            edge.source_id, edge.edge_type.value, edge.target_id,
        )
        return edge

    def get_edge(self, edge_id: str) -> Optional[GraphEdge]:
        """Retrieve an edge by ID."""
        return self._edges.get(edge_id)

    def find_edges_by_type(self, edge_type: EdgeType) -> List[GraphEdge]:
        """Find all edges of a given type."""
        return [self._edges[eid] for eid in self._edge_type_index[edge_type] if eid in self._edges]

    def get_neighbors(self, node_id: str, edge_type: Optional[EdgeType] = None) -> List[GraphNode]:
        """Get neighboring nodes, optionally filtered by edge type."""
        neighbors = self._adjacency.get(node_id, set()) | self._reverse_adjacency.get(node_id, set())
        if edge_type is not None:
            filtered = set()
            for nid in neighbors:
                for eid in self._node_edges.get(node_id, set()):
                    edge = self._edges.get(eid)
                    if edge and edge.edge_type == edge_type:
                        if edge.source_id == nid or edge.target_id == nid:
                            filtered.add(nid)
            neighbors = filtered
        return [self._nodes[nid] for nid in neighbors if nid in self._nodes]

    def get_edges_for_node(self, node_id: str) -> List[GraphEdge]:
        """Get all edges connected to a node."""
        return [self._edges[eid] for eid in self._node_edges.get(node_id, set()) if eid in self._edges]

    def remove_edge(self, edge_id: str) -> bool:
        """Remove an edge from the graph."""
        if edge_id not in self._edges:
            return False
        edge = self._edges[edge_id]
        self._adjacency[edge.source_id].discard(edge.target_id)
        self._reverse_adjacency[edge.target_id].discard(edge.source_id)
        self._node_edges[edge.source_id].discard(edge_id)
        self._node_edges[edge.target_id].discard(edge_id)
        self._edge_type_index[edge.edge_type].discard(edge_id)
        del self._edges[edge_id]
        return True

    # -- Graph Statistics --

    @property
    def node_count(self) -> int:
        return len(self._nodes)

    @property
    def edge_count(self) -> int:
        return len(self._edges)

    def density(self) -> float:
        """Graph density (ratio of actual to possible edges)."""
        n = self.node_count
        if n <= 1:
            return 0.0
        return self.edge_count / (n * (n - 1))

    def connected_components(self) -> List[Set[str]]:
        """Find connected components using BFS."""
        visited: Set[str] = set()
        components: List[Set[str]] = []
        for node_id in self._nodes:
            if node_id not in visited:
                component: Set[str] = set()
                queue = [node_id]
                while queue:
                    current = queue.pop(0)
                    if current in visited:
                        continue
                    visited.add(current)
                    component.add(current)
                    neighbors = (
                        self._adjacency.get(current, set())
                        | self._reverse_adjacency.get(current, set())
                    )
                    for nbr in neighbors:
                        if nbr not in visited:
                            queue.append(nbr)
                components.append(component)
        return components

    def shortest_path(self, source_id: str, target_id: str) -> Optional[List[str]]:
        """BFS shortest path between two nodes."""
        if source_id == target_id:
            return [source_id]
        visited: Set[str] = {source_id}
        queue: List[Tuple[str, List[str]]] = [(source_id, [source_id])]
        while queue:
            current, path = queue.pop(0)
            neighbors = (
                self._adjacency.get(current, set())
                | self._reverse_adjacency.get(current, set())
            )
            for nbr in neighbors:
                if nbr == target_id:
                    return path + [nbr]
                if nbr not in visited:
                    visited.add(nbr)
                    queue.append((nbr, path + [nbr]))
        return None


# ---------------------------------------------------------------------------
# Email Graph Builder
# ---------------------------------------------------------------------------


class EmailGraphBuilder:
    """
    Builds and maintains the knowledge graph from email communications.
    Performs NLP-lite content analysis for topic extraction and expertise
    mapping.
    """

    # Common stopwords for basic text processing
    STOPWORDS: Set[str] = {
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "shall", "can", "need", "dare", "ought",
        "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
        "as", "into", "through", "during", "before", "after", "above",
        "below", "between", "out", "off", "over", "under", "again",
        "further", "then", "once", "here", "there", "when", "where", "why",
        "how", "all", "both", "each", "few", "more", "most", "other",
        "some", "such", "no", "nor", "not", "only", "own", "same", "so",
        "than", "too", "very", "just", "because", "but", "and", "or", "if",
        "while", "that", "this", "it", "its", "i", "me", "my", "we", "our",
        "you", "your", "he", "him", "his", "she", "her", "they", "them",
        "their", "what", "which", "who", "whom", "these", "those", "am",
        "about", "up", "down", "also", "please", "thanks", "thank", "regards",
        "hi", "hello", "dear", "best", "cheers", "let", "know", "get",
    }

    # Keyword categories for topic detection
    TOPIC_KEYWORDS: Dict[str, List[str]] = {
        "machine_learning": [
            "model", "training", "neural", "network", "dataset", "accuracy",
            "inference", "prediction", "classification", "regression",
            "deep learning", "transformer", "bert", "gpt", "fine-tuning",
        ],
        "infrastructure": [
            "server", "deploy", "kubernetes", "docker", "cloud", "aws",
            "azure", "gcp", "ci/cd", "pipeline", "monitoring", "scaling",
            "load balancer", "cdn", "database", "migration",
        ],
        "security": [
            "vulnerability", "patch", "encryption", "authentication",
            "authorization", "firewall", "breach", "incident", "compliance",
            "audit", "penetration", "ssl", "tls", "certificate",
        ],
        "product": [
            "feature", "release", "sprint", "backlog", "user story",
            "roadmap", "milestone", "launch", "beta", "feedback",
            "requirements", "specification", "design",
        ],
        "finance": [
            "budget", "revenue", "cost", "invoice", "payment", "quarterly",
            "forecast", "profit", "expense", "allocation", "funding",
        ],
        "hr_people": [
            "hiring", "interview", "onboarding", "performance", "review",
            "salary", "benefits", "leave", "promotion", "training",
            "team building", "culture",
        ],
    }

    def __init__(self, graph: Optional[KnowledgeGraph] = None) -> None:
        self.graph = graph or KnowledgeGraph()
        self._emails: List[EmailMessage] = []
        self._expertise_cache: Dict[str, List[ExpertiseScore]] = {}
        self._person_email_count: Counter = Counter()
        self._topic_frequency: Dict[str, Counter] = defaultdict(Counter)

    def _generate_id(self, prefix: str, *parts: str) -> str:
        """Generate a deterministic ID from parts."""
        raw = "|".join(parts)
        hash_digest = hashlib.md5(raw.encode()).hexdigest()[:12]
        return f"{prefix}_{hash_digest}"

    def _extract_topics(self, text: str) -> Dict[str, float]:
        """Extract topics from text using keyword matching."""
        text_lower = text.lower()
        words = set(re.findall(r'\b[a-z]+\b', text_lower))
        bigrams = set()
        word_list = re.findall(r'\b[a-z]+\b', text_lower)
        for i in range(len(word_list) - 1):
            bigrams.add(f"{word_list[i]} {word_list[i+1]}")

        scores: Dict[str, float] = {}
        for topic, keywords in self.TOPIC_KEYWORDS.items():
            hits = 0
            for kw in keywords:
                if " " in kw:
                    if kw in text_lower:
                        hits += 2
                elif kw in words:
                    hits += 1
            if hits > 0:
                scores[topic] = min(1.0, hits / max(len(keywords) * 0.3, 1))
        return scores

    def _extract_key_phrases(self, text: str, max_phrases: int = 10) -> List[str]:
        """Extract key phrases from text (simple TF-based)."""
        text_lower = text.lower()
        words = re.findall(r'\b[a-z]{3,}\b', text_lower)
        filtered = [w for w in words if w not in self.STOPWORDS]
        counter = Counter(filtered)
        return [phrase for phrase, _ in counter.most_common(max_phrases)]

    def _get_or_create_person(self, email_address: str) -> GraphNode:
        """Get or create a person node."""
        node_id = self._generate_id("person", email_address.lower())
        existing = self.graph.get_node(node_id)
        if existing:
            return existing
        name = email_address.split("@")[0].replace(".", " ").title()
        domain = email_address.split("@")[-1] if "@" in email_address else ""
        node = GraphNode(
            node_id=node_id,
            node_type=NodeType.PERSON,
            label=name,
            metadata={"email": email_address.lower(), "domain": domain},
        )
        return self.graph.add_node(node)

    def _get_or_create_topic(self, topic_name: str) -> GraphNode:
        """Get or create a topic node."""
        node_id = self._generate_id("topic", topic_name.lower())
        existing = self.graph.get_node(node_id)
        if existing:
            return existing
        node = GraphNode(
            node_id=node_id,
            node_type=NodeType.TOPIC,
            label=topic_name.replace("_", " ").title(),
            metadata={"raw_name": topic_name},
        )
        return self.graph.add_node(node)

    def _get_or_create_project(self, project_name: str) -> GraphNode:
        """Get or create a project node."""
        node_id = self._generate_id("project", project_name.lower())
        existing = self.graph.get_node(node_id)
        if existing:
            return existing
        node = GraphNode(
            node_id=node_id,
            node_type=NodeType.PROJECT,
            label=project_name,
            metadata={},
        )
        return self.graph.add_node(node)

    def _get_or_create_company(self, domain: str) -> GraphNode:
        """Get or create a company node from email domain."""
        node_id = self._generate_id("company", domain.lower())
        existing = self.graph.get_node(node_id)
        if existing:
            return existing
        company_name = domain.split(".")[0].title()
        node = GraphNode(
            node_id=node_id,
            node_type=NodeType.COMPANY,
            label=company_name,
            metadata={"domain": domain},
        )
        return self.graph.add_node(node)

    def _upsert_edge(
        self,
        edge_type: EdgeType,
        source_id: str,
        target_id: str,
        weight: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> GraphEdge:
        """Insert or update an edge between two nodes."""
        # Check for existing edge
        for eid in self.graph._node_edges.get(source_id, set()):
            edge = self.graph.get_edge(eid)
            if edge and edge.edge_type == edge_type and edge.target_id == target_id:
                edge.weight = min(10.0, edge.weight + weight * 0.1)
                edge.interactions += 1
                edge.last_interaction = datetime.utcnow()
                edge.updated_at = datetime.utcnow()
                if metadata:
                    edge.metadata.update(metadata)
                return edge

        edge = GraphEdge(
            edge_id=self._generate_id(
                "edge", edge_type.value, source_id, target_id, str(uuid.uuid4())[:8]
            ),
            edge_type=edge_type,
            source_id=source_id,
            target_id=target_id,
            weight=weight,
            metadata=metadata or {},
            interactions=1,
            last_interaction=datetime.utcnow(),
        )
        return self.graph.add_edge(edge)

    def ingest_email(self, email: EmailMessage) -> Dict[str, Any]:
        """
        Ingest a single email into the knowledge graph.
        Creates/updates nodes and edges based on email content and metadata.
        """
        self._emails.append(email)
        stats: Dict[str, Any] = {
            "nodes_created": 0,
            "edges_created": 0,
            "topics_extracted": [],
            "people_processed": [],
        }

        # Process sender
        sender_node = self._get_or_create_person(email.sender)
        self._person_email_count[email.sender] += 1
        stats["people_processed"].append(email.sender)

        # Process company from sender domain
        if "@" in email.sender:
            domain = email.sender.split("@")[-1]
            company = self._get_or_create_company(domain)
            self._upsert_edge(EdgeType.BELONGS_TO, sender_node.node_id, company.node_id)

        # Process all recipients
        all_participants = email.recipients + email.cc + email.bcc
        for recipient in all_participants:
            recip_node = self._get_or_create_person(recipient)
            stats["people_processed"].append(recipient)

            # communicates_with edge
            self._upsert_edge(
                EdgeType.COMMUNICATES_WITH,
                sender_node.node_id,
                recip_node.node_id,
                weight=1.0,
                metadata={"subject": email.subject[:100]},
            )

            # Recipient company
            if "@" in recipient:
                r_domain = recipient.split("@")[-1]
                r_company = self._get_or_create_company(r_domain)
                self._upsert_edge(EdgeType.BELONGS_TO, recip_node.node_id, r_company.node_id)

        # Extract topics from content
        full_text = f"{email.subject} {email.body}"
        topics = self._extract_topics(full_text)

        for topic_name, score in topics.items():
            topic_node = self._get_or_create_topic(topic_name)
            stats["topics_extracted"].append(topic_name)

            # Sender discusses topic
            self._upsert_edge(
                EdgeType.DISCUSSES,
                sender_node.node_id,
                topic_node.node_id,
                weight=score,
                metadata={"email_id": email.message_id, "timestamp": email.timestamp.isoformat()},
            )

            # Recipients also discuss topic (with lower weight)
            for recipient in all_participants:
                recip_node = self._get_or_create_person(recipient)
                self._upsert_edge(
                    EdgeType.DISCUSSES,
                    recip_node.node_id,
                    topic_node.node_id,
                    weight=score * 0.7,
                    metadata={"email_id": email.message_id, "role": "recipient"},
                )

            # Update topic frequency tracking
            time_bucket = email.timestamp.strftime("%Y-%m")
            self._topic_frequency[topic_name][time_bucket] += 1

        # Extract key phrases as additional topic nodes
        key_phrases = self._extract_key_phrases(full_text)
        for phrase in key_phrases[:5]:
            topic_node = self._get_or_create_topic(phrase)
            self._upsert_edge(
                EdgeType.MENTIONS,
                sender_node.node_id,
                topic_node.node_id,
                weight=0.5,
            )

        # Detect project references (simple pattern: [PROJECT-xxx] or #project-name)
        project_matches = re.findall(r'\[([A-Z]+-\d+)\]|#([a-z][a-z0-9-]+)', full_text)
        for match in project_matches:
            project_name = match[0] or match[1]
            if project_name:
                project_node = self._get_or_create_project(project_name)
                self._upsert_edge(
                    EdgeType.WORKS_ON,
                    sender_node.node_id,
                    project_node.node_id,
                    metadata={"email_id": email.message_id},
                )

        # Invalidate expertise cache
        self._expertise_cache.clear()

        stats["nodes_created"] = self.graph.node_count
        stats["edges_created"] = self.graph.edge_count
        return stats

    def ingest_batch(self, emails: List[EmailMessage]) -> Dict[str, Any]:
        """Ingest a batch of emails."""
        total_stats: Dict[str, Any] = {
            "emails_processed": 0,
            "total_nodes": 0,
            "total_edges": 0,
        }
        for email in emails:
            self.ingest_email(email)
            total_stats["emails_processed"] += 1
        total_stats["total_nodes"] = self.graph.node_count
        total_stats["total_edges"] = self.graph.edge_count
        logger.info(
            "Batch ingestion complete: %d emails, %d nodes, %d edges",
            total_stats["emails_processed"],
            total_stats["total_nodes"],
            total_stats["total_edges"],
        )
        return total_stats


# ---------------------------------------------------------------------------
# Expertise Analyzer
# ---------------------------------------------------------------------------


class ExpertiseAnalyzer:
    """
    Analyzes email content to determine expertise levels for each person
    across topics. Uses frequency, depth, recency, and authority signals.
    """

    def __init__(self, graph: KnowledgeGraph, builder: EmailGraphBuilder) -> None:
        self.graph = graph
        self.builder = builder

    def compute_expertise(self, person_id: Optional[str] = None) -> List[ExpertiseScore]:
        """
        Compute expertise scores for one or all people.
        Considers: discussion frequency, email depth, recency, and authority.
        """
        people = (
            [self.graph.get_node(person_id)]
            if person_id
            else self.graph.find_nodes_by_type(NodeType.PERSON)
        )

        all_scores: List[ExpertiseScore] = []
        for person in people:
            if person is None:
                continue
            scores = self._analyze_person_expertise(person)
            all_scores.extend(scores)
            self.builder._expertise_cache[person.node_id] = scores

        return all_scores

    def _analyze_person_expertise(self, person: GraphNode) -> List[ExpertiseScore]:
        """Analyze expertise for a single person."""
        edges = self.graph.get_edges_for_node(person.node_id)
        topic_interactions: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"count": 0, "total_weight": 0.0, "last_seen": None, "is_sender": 0}
        )

        for edge in edges:
            if edge.edge_type not in (EdgeType.DISCUSSES, EdgeType.MENTIONS):
                continue
            # Determine the topic node
            topic_id = edge.target_id if edge.source_id == person.node_id else edge.source_id
            topic_node = self.graph.get_node(topic_id)
            if not topic_node or topic_node.node_type not in (NodeType.TOPIC,):
                continue

            data = topic_interactions[topic_node.label]
            data["count"] += edge.interactions
            data["total_weight"] += edge.weight
            is_sender = 1 if edge.source_id == person.node_id else 0
            data["is_sender"] += is_sender
            if edge.last_interaction:
                if data["last_seen"] is None or edge.last_interaction > data["last_seen"]:
                    data["last_seen"] = edge.last_interaction

        scores: List[ExpertiseScore] = []
        for topic, data in topic_interactions.items():
            # Frequency component (0-0.4)
            freq_score = min(0.4, data["count"] * 0.05)
            # Depth component (0-0.3)
            depth_score = min(0.3, data["total_weight"] * 0.05)
            # Authority component (0-0.2) - sender > recipient
            auth_ratio = data["is_sender"] / max(data["count"], 1)
            auth_score = auth_ratio * 0.2
            # Recency component (0-0.1)
            recency_score = 0.0
            if data["last_seen"]:
                days_ago = (datetime.utcnow() - data["last_seen"]).days
                recency_score = max(0.0, 0.1 - days_ago * 0.001)

            total = freq_score + depth_score + auth_score + recency_score
            confidence = min(1.0, data["count"] * 0.1)

            scores.append(ExpertiseScore(
                person_id=person.node_id,
                topic=topic,
                score=total,
                evidence_count=data["count"],
                last_demonstrated=data["last_seen"],
                confidence=confidence,
            ))

        return sorted(scores, key=lambda s: s.score, reverse=True)

    def find_experts(self, topic: str, top_n: int = 5) -> List[ExpertiseScore]:
        """Find the top N experts for a given topic."""
        all_scores = self.compute_expertise()
        # Normalize: replace underscores with spaces for flexible matching
        search_norm = topic.lower().replace("_", " ")
        topic_scores = [
            s for s in all_scores
            if search_norm in s.topic.lower().replace("_", " ")
        ]
        topic_scores.sort(key=lambda s: s.score, reverse=True)
        return topic_scores[:top_n]

    def get_person_expertise(self, person_email: str) -> List[ExpertiseScore]:
        """Get expertise profile for a specific person."""
        person_id = self.builder._generate_id("person", person_email.lower())
        if person_id in self.builder._expertise_cache:
            return self.builder._expertise_cache[person_id]
        return self._analyze_person_expertise(
            self.graph.get_node(person_id) or GraphNode(
                node_id=person_id, node_type=NodeType.PERSON, label=""
            )
        )


# ---------------------------------------------------------------------------
# Network Analyzer
# ---------------------------------------------------------------------------


class NetworkAnalyzer:
    """
    Performs organizational network analysis including centrality measures,
    clustering coefficients, and community detection.
    """

    def __init__(self, graph: KnowledgeGraph) -> None:
        self.graph = graph

    def compute_all_metrics(self, node_id: Optional[str] = None) -> Dict[str, NetworkMetrics]:
        """Compute network metrics for one or all nodes."""
        targets = (
            [node_id] if node_id else list(self.graph._nodes.keys())
        )
        metrics: Dict[str, NetworkMetrics] = {}
        for nid in targets:
            m = NetworkMetrics(node_id=nid)
            m.degree_centrality = self._degree_centrality(nid)
            m.betweenness_centrality = self._betweenness_centrality(nid)
            m.clustering_coefficient = self._clustering_coefficient(nid)
            m.closeness_centrality = self._closeness_centrality(nid)
            metrics[nid] = m
        return metrics

    def _degree_centrality(self, node_id: str) -> float:
        """Compute degree centrality for a node."""
        n = self.graph.node_count
        if n <= 1:
            return 0.0
        degree = len(
            self.graph._adjacency.get(node_id, set())
            | self.graph._reverse_adjacency.get(node_id, set())
        )
        return degree / (n - 1)

    def _betweenness_centrality(self, node_id: str) -> float:
        """
        Approximate betweenness centrality using sampling.
        Full betweenness is O(V*E), so we sample for large graphs.
        """
        all_nodes = list(self.graph._nodes.keys())
        if len(all_nodes) <= 2:
            return 0.0

        # Sample pairs for efficiency
        sample_size = min(50, len(all_nodes) * (len(all_nodes) - 1))
        import random
        random.seed(42)
        pairs = []
        attempts = 0
        while len(pairs) < sample_size and attempts < sample_size * 3:
            s, t = random.sample(all_nodes, 2)
            if s != node_id and t != node_id:
                pairs.append((s, t))
            attempts += 1

        if not pairs:
            return 0.0

        passes_through = 0
        total_paths = 0
        for s, t in pairs:
            path = self.graph.shortest_path(s, t)
            if path and len(path) > 2:
                total_paths += 1
                if node_id in path[1:-1]:
                    passes_through += 1

        return passes_through / max(total_paths, 1)

    def _clustering_coefficient(self, node_id: str) -> float:
        """Compute local clustering coefficient."""
        neighbors = list(
            self.graph._adjacency.get(node_id, set())
            | self.graph._reverse_adjacency.get(node_id, set())
        )
        k = len(neighbors)
        if k <= 1:
            return 0.0

        # Count edges between neighbors
        links = 0
        for i, ni in enumerate(neighbors):
            for nj in neighbors[i + 1:]:
                if nj in self.graph._adjacency.get(ni, set()) or ni in self.graph._adjacency.get(nj, set()):
                    links += 1

        possible = k * (k - 1) / 2
        return links / possible if possible > 0 else 0.0

    def _closeness_centrality(self, node_id: str) -> float:
        """Compute closeness centrality."""
        all_nodes = list(self.graph._nodes.keys())
        total_distance = 0
        reachable = 0
        for other in all_nodes:
            if other == node_id:
                continue
            path = self.graph.shortest_path(node_id, other)
            if path:
                total_distance += len(path) - 1
                reachable += 1
        if reachable == 0 or total_distance == 0:
            return 0.0
        return reachable / total_distance

    def pagerank(self, damping: float = 0.85, max_iter: int = 50, tol: float = 1e-6) -> Dict[str, float]:
        """Compute PageRank for all nodes."""
        nodes = list(self.graph._nodes.keys())
        n = len(nodes)
        if n == 0:
            return {}

        rank: Dict[str, float] = {nid: 1.0 / n for nid in nodes}
        for _ in range(max_iter):
            new_rank: Dict[str, float] = {}
            for nid in nodes:
                incoming = self.graph._reverse_adjacency.get(nid, set())
                s = 0.0
                for src in incoming:
                    out_degree = len(self.graph._adjacency.get(src, set()))
                    if out_degree > 0:
                        s += rank[src] / out_degree
                new_rank[nid] = (1 - damping) / n + damping * s
            # Check convergence
            diff = sum(abs(new_rank[nid] - rank[nid]) for nid in nodes)
            rank = new_rank
            if diff < tol:
                break
        return rank

    def find_key_people(self, top_n: int = 5) -> List[Tuple[str, float]]:
        """Find the most central people in the network."""
        pr = self.pagerank()
        people = self.graph.find_nodes_by_type(NodeType.PERSON)
        person_scores = [(p.label, pr.get(p.node_id, 0.0)) for p in people]
        person_scores.sort(key=lambda x: x[1], reverse=True)
        return person_scores[:top_n]


# ---------------------------------------------------------------------------
# Topic Trend Detector
# ---------------------------------------------------------------------------


class TopicTrendDetector:
    """
    Detects trends in topic discussion frequency over time.
    Identifies rising, declining, emerging, and fading topics.
    """

    def __init__(self, builder: EmailGraphBuilder) -> None:
        self.builder = builder

    def analyze_trends(
        self,
        window_days: int = 30,
        comparison_periods: int = 3,
    ) -> List[TopicTrend]:
        """Analyze topic trends comparing recent window to historical."""
        trends: List[TopicTrend] = []
        now = datetime.utcnow()

        for topic, freq_map in self.builder._topic_frequency.items():
            trend = self._compute_trend(topic, freq_map, now, window_days, comparison_periods)
            if trend:
                trends.append(trend)

        trends.sort(key=lambda t: abs(t.change_rate), reverse=True)
        return trends

    def _compute_trend(
        self,
        topic: str,
        freq_map: Counter,
        now: datetime,
        window_days: int,
        comparison_periods: int,
    ) -> Optional[TopicTrend]:
        """Compute trend for a single topic."""
        if not freq_map:
            return None

        # Current period
        current_bucket = now.strftime("%Y-%m")
        current_freq = freq_map.get(current_bucket, 0)

        # Previous periods
        prev_freqs: List[float] = []
        for i in range(1, comparison_periods + 1):
            prev_date = now - timedelta(days=window_days * i)
            bucket = prev_date.strftime("%Y-%m")
            prev_freqs.append(freq_map.get(bucket, 0))

        avg_prev = sum(prev_freqs) / max(len(prev_freqs), 1)

        # Calculate change rate
        if avg_prev > 0:
            change_rate = (current_freq - avg_prev) / avg_prev
        elif current_freq > 0:
            change_rate = 1.0  # Emerging topic
        else:
            change_rate = 0.0

        # Determine direction
        if current_freq == 0 and avg_prev == 0:
            return None
        elif avg_prev == 0 and current_freq > 0:
            direction = TrendDirection.EMERGING
        elif change_rate > 0.3:
            direction = TrendDirection.RISING
        elif change_rate < -0.3:
            direction = TrendDirection.DECLINING
        elif current_freq == 0 and avg_prev > 0:
            direction = TrendDirection.FADING
        else:
            direction = TrendDirection.STABLE

        # Find involved people
        topic_nodes = self.builder.graph.find_nodes_by_label(topic)
        involved: List[str] = []
        for tn in topic_nodes:
            neighbors = self.builder.graph.get_neighbors(tn.node_id, EdgeType.DISCUSSES)
            involved.extend(n.label for n in neighbors)

        return TopicTrend(
            topic=topic,
            direction=direction,
            current_frequency=float(current_freq),
            previous_frequency=avg_prev,
            change_rate=change_rate,
            involved_people=list(dict.fromkeys(involved)),
            window_start=now - timedelta(days=window_days),
            window_end=now,
        )


# ---------------------------------------------------------------------------
# Collaboration Pattern Discovery
# ---------------------------------------------------------------------------


class CollaborationAnalyzer:
    """
    Discovers collaboration patterns in the email network.
    Identifies hub-and-spoke, tight clusters, bridge connectors, silos, etc.
    """

    def __init__(self, graph: KnowledgeGraph, analyzer: NetworkAnalyzer) -> None:
        self.graph = graph
        self.analyzer = analyzer

    def discover_patterns(self) -> List[CollaborationCluster]:
        """Discover all collaboration patterns in the network."""
        patterns: List[CollaborationCluster] = []
        people = self.graph.find_nodes_by_type(NodeType.PERSON)

        if len(people) < 2:
            return patterns

        # Compute metrics for all people
        metrics = self.analyzer.compute_all_metrics()

        # Find hub-and-spoke patterns
        hubs = self._find_hubs(people, metrics)
        patterns.extend(hubs)

        # Find tight clusters
        clusters = self._find_clusters(people, metrics)
        patterns.extend(clusters)

        # Find bridge connectors
        bridges = self._find_bridges(people, metrics)
        patterns.extend(bridges)

        # Find silos
        silos = self._find_silos(people)
        patterns.extend(silos)

        return patterns

    def _find_hubs(
        self, people: List[GraphNode], metrics: Dict[str, NetworkMetrics]
    ) -> List[CollaborationCluster]:
        """Find hub-and-spoke patterns (one central person, many peripheral)."""
        results: List[CollaborationCluster] = []
        for person in people:
            m = metrics.get(person.node_id)
            if not m:
                continue
            neighbors = self.graph.get_neighbors(person.node_id, EdgeType.COMMUNICATES_WITH)
            if len(neighbors) >= 3 and m.degree_centrality > 0.3:
                # Check if neighbors are not well-connected to each other
                neighbor_ids = [n.node_id for n in neighbors]
                inter_links = 0
                for i, ni in enumerate(neighbor_ids):
                    for nj in neighbor_ids[i + 1:]:
                        if nj in self.graph._adjacency.get(ni, set()):
                            inter_links += 1
                possible = len(neighbor_ids) * (len(neighbor_ids) - 1) / 2
                if possible > 0 and inter_links / possible < 0.3:
                    results.append(CollaborationCluster(
                        cluster_id=f"hub_{person.node_id}",
                        pattern=CollaborationPattern.HUB_AND_SPOKE,
                        members=[person.label] + [n.label for n in neighbors],
                        strength=m.degree_centrality,
                        description=f"{person.label} is a hub connecting {len(neighbors)} people",
                    ))
        return results

    def _find_clusters(
        self, people: List[GraphNode], metrics: Dict[str, NetworkMetrics]
    ) -> List[CollaborationCluster]:
        """Find tightly-knit collaboration clusters."""
        results: List[CollaborationCluster] = []
        visited: Set[str] = set()

        for person in people:
            if person.node_id in visited:
                continue
            m = metrics.get(person.node_id)
            if not m or m.clustering_coefficient < 0.5:
                continue

            # BFS to find cluster members
            cluster_members: List[str] = [person.node_id]
            queue = list(self.graph._adjacency.get(person.node_id, set()))
            while queue:
                nid = queue.pop(0)
                if nid in cluster_members or nid in visited:
                    continue
                nm = metrics.get(nid)
                if nm and nm.clustering_coefficient >= 0.4:
                    cluster_members.append(nid)
                    queue.extend(
                        n for n in self.graph._adjacency.get(nid, set())
                        if n not in cluster_members
                    )

            if len(cluster_members) >= 3:
                for mid in cluster_members:
                    visited.add(mid)
                labels = [
                    self.graph.get_node(mid).label
                    for mid in cluster_members
                    if self.graph.get_node(mid)
                ]
                results.append(CollaborationCluster(
                    cluster_id=f"cluster_{person.node_id[:8]}",
                    pattern=CollaborationPattern.TIGHT_CLUSTER,
                    members=labels,
                    strength=sum(
                        metrics[mid].clustering_coefficient
                        for mid in cluster_members
                        if mid in metrics
                    ) / len(cluster_members),
                    description=f"Tight cluster of {len(labels)} collaborators",
                ))
        return results

    def _find_bridges(
        self, people: List[GraphNode], metrics: Dict[str, NetworkMetrics]
    ) -> List[CollaborationCluster]:
        """Find bridge connectors between different groups."""
        results: List[CollaborationCluster] = []
        for person in people:
            m = metrics.get(person.node_id)
            if not m:
                continue
            if m.betweenness_centrality > 0.2:
                neighbors = self.graph.get_neighbors(person.node_id, EdgeType.COMMUNICATES_WITH)
                results.append(CollaborationCluster(
                    cluster_id=f"bridge_{person.node_id[:8]}",
                    pattern=CollaborationPattern.BRIDGE_CONNECTOR,
                    members=[person.label] + [n.label for n in neighbors[:5]],
                    strength=m.betweenness_centrality,
                    description=f"{person.label} bridges different groups (betweenness={m.betweenness_centrality:.2f})",
                ))
        return results

    def _find_silos(self, people: List[GraphNode]) -> List[CollaborationCluster]:
        """Find isolated groups (silos) with minimal cross-communication."""
        results: List[CollaborationCluster] = []
        components = self.graph.connected_components()
        person_ids = {p.node_id for p in people}

        for component in components:
            people_in_comp = component & person_ids
            if 2 <= len(people_in_comp) <= len(people) * 0.3:
                labels = [
                    self.graph.get_node(pid).label
                    for pid in people_in_comp
                    if self.graph.get_node(pid)
                ]
                results.append(CollaborationCluster(
                    cluster_id=f"silo_{hash(frozenset(people_in_comp)) % 10000:04d}",
                    pattern=CollaborationPattern.SILO,
                    members=labels,
                    strength=1.0 - len(people_in_comp) / max(len(people), 1),
                    description=f"Isolated group of {len(labels)} people with limited cross-team communication",
                ))
        return results


# ---------------------------------------------------------------------------
# Knowledge Gap Identifier
# ---------------------------------------------------------------------------


class KnowledgeGapIdentifier:
    """
    Identifies knowledge gaps in the organization by analyzing expertise
    distribution, topic coverage, and communication patterns.
    """

    def __init__(
        self,
        graph: KnowledgeGraph,
        expertise_analyzer: ExpertiseAnalyzer,
        builder: EmailGraphBuilder,
    ) -> None:
        self.graph = graph
        self.expertise = expertise_analyzer
        self.builder = builder

    def identify_gaps(self) -> List[KnowledgeGap]:
        """Identify all knowledge gaps."""
        gaps: List[KnowledgeGap] = []

        # Gap type 1: Topics with no clear expert
        gaps.extend(self._find_orphan_topics())

        # Gap type 2: Single points of failure
        gaps.extend(self._find_single_points_of_failure())

        # Gap type 3: Under-connected teams
        gaps.extend(self._find_connection_gaps())

        # Gap type 4: Declining expertise areas
        gaps.extend(self._find_stale_expertise())

        return gaps

    def _find_orphan_topics(self) -> List[KnowledgeGap]:
        """Find topics discussed but with no clear expert."""
        gaps: List[KnowledgeGap] = []
        topics = self.graph.find_nodes_by_type(NodeType.TOPIC)
        all_expertise = self.expertise.compute_expertise()

        for topic in topics:
            experts = [e for e in all_expertise if e.topic == topic.label and e.score > 0.3]
            if not experts:
                # Check if topic is actively discussed
                discuss_edges = [
                    e for e in self.graph.find_edges_by_type(EdgeType.DISCUSSES)
                    if e.target_id == topic.node_id or e.source_id == topic.node_id
                ]
                if len(discuss_edges) >= 2:
                    involved = set()
                    for edge in discuss_edges:
                        involved.add(edge.source_id)
                        involved.add(edge.target_id)
                    people_labels = [
                        self.graph.get_node(pid).label
                        for pid in involved
                        if self.graph.get_node(pid) and self.graph.get_node(pid).node_type == NodeType.PERSON
                    ]
                    gaps.append(KnowledgeGap(
                        gap_id=f"orphan_{topic.node_id[:8]}",
                        topic=topic.label,
                        severity=KnowledgeGapSeverity.HIGH if len(discuss_edges) > 5 else KnowledgeGapSeverity.MEDIUM,
                        description=f"Topic '{topic.label}' is discussed by {len(people_labels)} people but has no clear expert",
                        affected_people=people_labels,
                        suggested_actions=[
                            f"Identify and designate an expert for '{topic.label}'",
                            "Schedule knowledge-sharing session",
                            "Create documentation",
                        ],
                    ))
        return gaps

    def _find_single_points_of_failure(self) -> List[KnowledgeGap]:
        """Find topics where only one person has expertise."""
        gaps: List[KnowledgeGap] = []
        all_expertise = self.expertise.compute_expertise()
        topic_experts: Dict[str, List[ExpertiseScore]] = defaultdict(list)

        for score in all_expertise:
            if score.score > 0.3:
                topic_experts[score.topic].append(score)

        for topic, experts in topic_experts.items():
            if len(experts) == 1:
                person = self.graph.get_node(experts[0].person_id)
                person_label = person.label if person else "Unknown"
                gaps.append(KnowledgeGap(
                    gap_id=f"spof_{topic[:8]}",
                    topic=topic,
                    severity=KnowledgeGapSeverity.CRITICAL,
                    description=f"'{topic}' expertise depends solely on {person_label}",
                    affected_people=[person_label],
                    suggested_actions=[
                        f"Cross-train at least 2 additional people in '{topic}'",
                        "Document key knowledge and procedures",
                        "Establish mentorship program",
                    ],
                ))
        return gaps

    def _find_connection_gaps(self) -> List[KnowledgeGap]:
        """Find teams/people that should be connected but aren't."""
        gaps: List[KnowledgeGap] = []
        people = self.graph.find_nodes_by_type(NodeType.PERSON)
        topics = self.graph.find_nodes_by_type(NodeType.TOPIC)

        # Find people who discuss same topics but don't communicate
        topic_people: Dict[str, Set[str]] = defaultdict(set)
        for topic in topics:
            for edge in self.graph.find_edges_by_type(EdgeType.DISCUSSES):
                if edge.target_id == topic.node_id:
                    person = self.graph.get_node(edge.source_id)
                    if person and person.node_type == NodeType.PERSON:
                        topic_people[topic.label].add(person.node_id)

        for topic, person_ids in topic_people.items():
            if len(person_ids) < 2:
                continue
            people_list = list(person_ids)
            for i, p1 in enumerate(people_list):
                for p2 in people_list[i + 1:]:
                    # Check if they communicate
                    p1_neighbors = self.graph._adjacency.get(p1, set())
                    if p2 not in p1_neighbors:
                        p1_node = self.graph.get_node(p1)
                        p2_node = self.graph.get_node(p2)
                        if p1_node and p2_node:
                            gaps.append(KnowledgeGap(
                                gap_id=f"conn_{p1[:4]}_{p2[:4]}",
                                topic=topic,
                                severity=KnowledgeGapSeverity.LOW,
                                description=f"{p1_node.label} and {p2_node.label} both work on '{topic}' but don't communicate directly",
                                affected_people=[p1_node.label, p2_node.label],
                                suggested_actions=[
                                    "Introduce them via email",
                                    "Add to relevant mailing list",
                                    "Schedule joint meeting",
                                ],
                            ))
        return gaps[:10]  # Limit to avoid explosion

    def _find_stale_expertise(self) -> List[KnowledgeGap]:
        """Find areas where expertise hasn't been demonstrated recently."""
        gaps: List[KnowledgeGap] = []
        all_expertise = self.expertise.compute_expertise()
        stale_threshold = datetime.utcnow() - timedelta(days=90)

        topic_latest: Dict[str, Tuple[Optional[datetime], List[str]]] = defaultdict(
            lambda: (None, [])
        )

        for score in all_expertise:
            if score.score > 0.2:
                current_latest, people = topic_latest[score.topic]
                people.append(score.person_id)
                if score.last_demonstrated:
                    if current_latest is None or score.last_demonstrated > current_latest:
                        topic_latest[score.topic] = (score.last_demonstrated, people)

        for topic, (latest, people_ids) in topic_latest.items():
            if latest and latest < stale_threshold:
                labels = [
                    self.graph.get_node(pid).label
                    for pid in people_ids
                    if self.graph.get_node(pid)
                ]
                gaps.append(KnowledgeGap(
                    gap_id=f"stale_{topic[:8]}",
                    topic=topic,
                    severity=KnowledgeGapSeverity.MEDIUM,
                    description=f"Expertise in '{topic}' hasn't been demonstrated in 90+ days",
                    affected_people=labels,
                    suggested_actions=[
                        "Verify current expertise levels",
                        "Check if topic is still relevant",
                        "Schedule refresher training if needed",
                    ],
                ))
        return gaps


# ---------------------------------------------------------------------------
# Relationship Strength Scorer
# ---------------------------------------------------------------------------


class RelationshipScorer:
    """
    Scores relationship strength between entities based on multiple signals:
    frequency, recency, depth, diversity, and longevity.
    """

    def __init__(self, graph: KnowledgeGraph, builder: EmailGraphBuilder) -> None:
        self.graph = graph
        self.builder = builder

    def score_relationship(self, source_id: str, target_id: str) -> RelationshipStrength:
        """Score the relationship between two entities."""
        edges = self.graph.get_edges_for_node(source_id)
        relevant_edges = [
            e for e in edges
            if (e.source_id == target_id or e.target_id == target_id)
        ]

        if not relevant_edges:
            return RelationshipStrength(source_id=source_id, target_id=target_id)

        # Frequency score (0-1): based on number of interactions
        total_interactions = sum(e.interactions for e in relevant_edges)
        frequency_score = min(1.0, total_interactions / 20.0)

        # Recency score (0-1): based on most recent interaction
        latest = max(
            (e.last_interaction for e in relevant_edges if e.last_interaction),
            default=None,
        )
        recency_score = 0.0
        if latest:
            days_ago = (datetime.utcnow() - latest).days
            recency_score = max(0.0, 1.0 - days_ago / 90.0)

        # Depth score (0-1): based on edge weights and types
        total_weight = sum(e.weight for e in relevant_edges)
        depth_score = min(1.0, total_weight / 10.0)

        # Diversity score (0-1): based on variety of edge types
        edge_types = {e.edge_type for e in relevant_edges}
        diversity_score = len(edge_types) / len(EdgeType)

        # Longevity score (0-1): based on how long the relationship has existed
        earliest = min(
            (e.created_at for e in relevant_edges),
            default=datetime.utcnow(),
        )
        days_known = (datetime.utcnow() - earliest).days
        longevity_score = min(1.0, days_known / 365.0)

        # Overall weighted score
        overall = (
            frequency_score * 0.30
            + recency_score * 0.25
            + depth_score * 0.20
            + diversity_score * 0.15
            + longevity_score * 0.10
        )

        return RelationshipStrength(
            source_id=source_id,
            target_id=target_id,
            overall_score=overall,
            frequency_score=frequency_score,
            recency_score=recency_score,
            depth_score=depth_score,
            diversity_score=diversity_score,
            longevity_score=longevity_score,
        )

    def score_all_relationships(self, person_id: str) -> List[RelationshipStrength]:
        """Score all relationships for a given person."""
        neighbors = self.graph.get_neighbors(person_id, EdgeType.COMMUNICATES_WITH)
        scores = [self.score_relationship(person_id, n.node_id) for n in neighbors]
        scores.sort(key=lambda s: s.overall_score, reverse=True)
        return scores


# ---------------------------------------------------------------------------
# Graph Query Interface
# ---------------------------------------------------------------------------


class GraphQueryEngine:
    """
    High-level query interface for the knowledge graph.
    Supports natural-language-style queries for experts, paths, and subgraphs.
    """

    def __init__(
        self,
        graph: KnowledgeGraph,
        builder: EmailGraphBuilder,
        expertise_analyzer: ExpertiseAnalyzer,
        network_analyzer: NetworkAnalyzer,
    ) -> None:
        self.graph = graph
        self.builder = builder
        self.expertise = expertise_analyzer
        self.network = network_analyzer

    def find_experts_in(self, topic: str, top_n: int = 5) -> QueryResult:
        """Find the top experts in a given topic."""
        import time
        start = time.time()
        experts = self.expertise.find_experts(topic, top_n)
        elapsed = (time.time() - start) * 1000
        return QueryResult(
            query_type="find_experts",
            results=[
                {
                    "person": self.graph.get_node(e.person_id).label if self.graph.get_node(e.person_id) else e.person_id,
                    "score": round(e.score, 3),
                    "confidence": round(e.confidence, 3),
                    "evidence_count": e.evidence_count,
                }
                for e in experts
            ],
            metadata={"topic": topic, "count": len(experts)},
            execution_time_ms=elapsed,
        )

    def who_discussed_with(self, person_email: str, topic: str) -> QueryResult:
        """Find who discussed a topic with a given person."""
        import time
        start = time.time()
        person_id = self.builder._generate_id("person", person_email.lower())
        person_node = self.graph.get_node(person_id)
        if not person_node:
            return QueryResult(
                query_type="who_discussed_with",
                results=[],
                metadata={"error": "Person not found"},
                execution_time_ms=(time.time() - start) * 1000,
            )

        # Find topics matching
        topic_nodes = self.graph.find_nodes_by_label(topic)
        results = []
        for tn in topic_nodes:
            # Find all people who also discuss this topic
            for edge in self.graph.find_edges_by_type(EdgeType.DISCUSSES):
                if edge.target_id == tn.node_id and edge.source_id != person_id:
                    other = self.graph.get_node(edge.source_id)
                    if other and other.node_type == NodeType.PERSON:
                        results.append({
                            "person": other.label,
                            "topic": tn.label,
                            "weight": round(edge.weight, 3),
                            "interactions": edge.interactions,
                        })

        elapsed = (time.time() - start) * 1000
        return QueryResult(
            query_type="who_discussed_with",
            results=results,
            metadata={"person": person_email, "topic": topic},
            execution_time_ms=elapsed,
        )

    def find_path_between(self, person1_email: str, person2_email: str) -> QueryResult:
        """Find the shortest communication path between two people."""
        import time
        start = time.time()
        p1_id = self.builder._generate_id("person", person1_email.lower())
        p2_id = self.builder._generate_id("person", person2_email.lower())

        path = self.graph.shortest_path(p1_id, p2_id)
        results = []
        if path:
            for node_id in path:
                node = self.graph.get_node(node_id)
                if node:
                    results.append({
                        "node_id": node.node_id,
                        "label": node.label,
                        "type": node.node_type.name,
                    })

        elapsed = (time.time() - start) * 1000
        return QueryResult(
            query_type="find_path",
            results=results,
            metadata={
                "source": person1_email,
                "target": person2_email,
                "path_length": len(path) - 1 if path else -1,
            },
            execution_time_ms=elapsed,
        )

    def get_person_profile(self, person_email: str) -> QueryResult:
        """Get comprehensive profile for a person."""
        import time
        start = time.time()
        person_id = self.builder._generate_id("person", person_email.lower())
        person = self.graph.get_node(person_id)
        if not person:
            return QueryResult(
                query_type="person_profile",
                results=[],
                metadata={"error": "Person not found"},
            )

        expertise = self.expertise.get_person_expertise(person_email)
        metrics = self.network.compute_all_metrics(person_id)
        relationships = RelationshipScorer(self.graph, self.builder).score_all_relationships(person_id)

        profile = {
            "name": person.label,
            "email": person.metadata.get("email", ""),
            "expertise": [
                {"topic": e.topic, "score": round(e.score, 3)}
                for e in expertise[:10]
            ],
            "network_metrics": {
                "degree_centrality": round(metrics[person_id].degree_centrality, 3) if person_id in metrics else 0,
                "betweenness": round(metrics[person_id].betweenness_centrality, 3) if person_id in metrics else 0,
                "clustering": round(metrics[person_id].clustering_coefficient, 3) if person_id in metrics else 0,
            },
            "top_relationships": [
                {
                    "person": self.graph.get_node(r.target_id).label if self.graph.get_node(r.target_id) else r.target_id,
                    "strength": round(r.overall_score, 3),
                }
                for r in relationships[:5]
            ],
            "communication_count": self.builder._person_email_count.get(person_email, 0),
        }

        elapsed = (time.time() - start) * 1000
        return QueryResult(
            query_type="person_profile",
            results=[profile],
            metadata={"person": person_email},
            execution_time_ms=elapsed,
        )

    def subgraph_around(self, person_email: str, depth: int = 2) -> QueryResult:
        """Extract subgraph around a person."""
        import time
        start = time.time()
        person_id = self.builder._generate_id("person", person_email.lower())

        visited: Set[str] = {person_id}
        frontier: Set[str] = {person_id}
        for _ in range(depth):
            next_frontier: Set[str] = set()
            for nid in frontier:
                neighbors = (
                    self.graph._adjacency.get(nid, set())
                    | self.graph._reverse_adjacency.get(nid, set())
                )
                for nbr in neighbors:
                    if nbr not in visited:
                        visited.add(nbr)
                        next_frontier.add(nbr)
            frontier = next_frontier

        nodes = []
        for nid in visited:
            node = self.graph.get_node(nid)
            if node:
                nodes.append({"id": nid, "label": node.label, "type": node.node_type.name})

        edges = []
        for nid in visited:
            for edge in self.graph.get_edges_for_node(nid):
                if edge.source_id in visited and edge.target_id in visited:
                    edges.append({
                        "source": edge.source_id,
                        "target": edge.target_id,
                        "type": edge.edge_type.value,
                        "weight": round(edge.weight, 3),
                    })

        # Deduplicate edges
        seen_edges: Set[FrozenSet] = set()
        unique_edges = []
        for e in edges:
            key = frozenset([e["source"], e["target"], e["type"]])
            if key not in seen_edges:
                seen_edges.add(key)
                unique_edges.append(e)

        elapsed = (time.time() - start) * 1000
        return QueryResult(
            query_type="subgraph",
            results={"nodes": nodes, "edges": unique_edges},
            metadata={"center": person_email, "depth": depth, "node_count": len(nodes)},
            execution_time_ms=elapsed,
        )


# ---------------------------------------------------------------------------
# Reply-All Enforcement
# ---------------------------------------------------------------------------


class ReplyAllEnforcer:
    """
    Analyzes emails to determine when reply-all should be enforced
    for knowledge-sharing purposes. Evaluates knowledge value and
    identifies missing stakeholders.
    """

    def __init__(
        self,
        graph: KnowledgeGraph,
        builder: EmailGraphBuilder,
        expertise_analyzer: ExpertiseAnalyzer,
    ) -> None:
        self.graph = graph
        self.builder = builder
        self.expertise = expertise_analyzer

    def evaluate_email(self, email: EmailMessage) -> ReplyAllEnforcement:
        """
        Evaluate whether an email should use reply-all for knowledge sharing.
        """
        # Analyze knowledge value of the email
        knowledge_score = self._compute_knowledge_value(email)

        # Find stakeholders who should be included
        missing = self._find_missing_stakeholders(email)

        # Determine if reply-all is recommended
        should_reply_all = knowledge_score > 0.5 or len(missing) > 0

        reason = ""
        if knowledge_score > 0.7:
            reason = "High knowledge value - contains expertise-relevant information"
        elif knowledge_score > 0.5:
            reason = "Moderate knowledge value - relevant to ongoing discussions"
        elif missing:
            reason = f"Missing {len(missing)} stakeholders who should be informed"
        else:
            reason = "Low knowledge value - direct reply sufficient"

        action = ""
        if should_reply_all:
            action = "ENFORCE reply-all to ensure knowledge distribution"
            if missing:
                action += f". Consider adding: {', '.join(missing[:3])}"
        else:
            action = "Direct reply is sufficient"

        return ReplyAllEnforcement(
            email_id=email.message_id,
            should_reply_all=should_reply_all,
            reason=reason,
            missing_recipients=missing,
            knowledge_value_score=knowledge_score,
            recommended_action=action,
        )

    def _compute_knowledge_value(self, email: EmailMessage) -> float:
        """Compute the knowledge-sharing value of an email."""
        score = 0.0
        full_text = f"{email.subject} {email.body}"

        # Topic relevance
        topics = self.builder._extract_topics(full_text)
        if topics:
            score += min(0.4, len(topics) * 0.1)

        # Multiple recipients indicates knowledge sharing intent
        total_recipients = len(email.recipients) + len(email.cc)
        if total_recipients >= 3:
            score += 0.2
        elif total_recipients >= 2:
            score += 0.1

        # Content depth (longer emails tend to have more knowledge)
        word_count = len(full_text.split())
        if word_count > 200:
            score += 0.2
        elif word_count > 100:
            score += 0.1

        # Contains decision/action items
        action_keywords = ["decision", "agreed", "concluded", "action item", "next steps", "plan"]
        if any(kw in full_text.lower() for kw in action_keywords):
            score += 0.2

        # Is part of a thread (ongoing discussion)
        if email.is_reply or email.in_reply_to:
            score += 0.1

        return min(1.0, score)

    def _find_missing_stakeholders(self, email: EmailMessage) -> List[str]:
        """Find people who should be included but aren't."""
        full_text = f"{email.subject} {email.body}"
        topics = self.builder._extract_topics(full_text)
        current_participants = set(p.lower() for p in email.all_participants)
        missing: List[str] = []

        for topic in topics:
            experts = self.expertise.find_experts(topic, top_n=3)
            for expert in experts:
                person = self.graph.get_node(expert.person_id)
                if person:
                    email_addr = person.metadata.get("email", "")
                    if email_addr and email_addr.lower() not in current_participants:
                        if email_addr not in missing:
                            missing.append(email_addr)

        return missing[:5]  # Limit recommendations


# ---------------------------------------------------------------------------
# Test Scenarios
# ---------------------------------------------------------------------------


def create_test_emails() -> List[EmailMessage]:
    """Create a realistic set of test emails for demonstration."""
    base_time = datetime(2026, 5, 1, 9, 0)
    emails: List[EmailMessage] = []

    # Email 1: Alice sends ML architecture proposal to team
    emails.append(EmailMessage(
        message_id="msg001",
        sender="alice.chen@techcorp.com",
        recipients=["bob.smith@techcorp.com", "carol.davis@techcorp.com"],
        cc=["dave.wilson@techcorp.com"],
        subject="ML Model Architecture Proposal - Transformer Optimization",
        body=(
            "Hi team, I've completed the analysis of our transformer model optimization. "
            "The neural network training pipeline needs significant improvements. "
            "Key findings: 1) Our deep learning model accuracy can improve by 15% with "
            "better fine-tuning strategies. 2) The inference latency can be reduced "
            "by optimizing the attention mechanism. 3) Dataset augmentation will help "
            "with classification tasks. I recommend we schedule a deep dive session. "
            "Action item: Bob to review the regression benchmarks. "
            "Next steps: deploy to staging by end of sprint."
        ),
        timestamp=base_time,
        is_knowledge_sharing=True,
    ))

    # Email 2: Bob replies about infrastructure needs
    emails.append(EmailMessage(
        message_id="msg002",
        sender="bob.smith@techcorp.com",
        recipients=["alice.chen@techcorp.com"],
        cc=["carol.davis@techcorp.com", "dave.wilson@techcorp.com"],
        subject="Re: ML Model Architecture Proposal - Infrastructure Requirements",
        body=(
            "Alice, great analysis. From the infrastructure side, we need to consider: "
            "1) Kubernetes cluster scaling for the training pipeline. 2) Docker container "
            "optimization for model serving. 3) AWS GPU instance costs are significant - "
            "we should evaluate cloud vs on-prem. The CI/CD pipeline needs updating for "
            "the new model format. Database migration for the feature store is also needed. "
            "I'll set up the load balancer configuration for the inference endpoint."
        ),
        timestamp=base_time + timedelta(hours=2),
        is_reply=True,
        in_reply_to="msg001",
        thread_id="thread001",
    ))

    # Email 3: Carol discusses security implications
    emails.append(EmailMessage(
        message_id="msg003",
        sender="carol.davis@techcorp.com",
        recipients=["alice.chen@techcorp.com", "bob.smith@techcorp.com"],
        subject="Security Review - ML Pipeline Vulnerability Assessment",
        body=(
            "Team, I've reviewed the security implications of the new ML pipeline. "
            "Concerns: 1) Authentication for the model API needs OAuth2 implementation. "
            "2) Encryption at rest for training datasets. 3) The firewall rules need "
            "updating for the new endpoints. 4) We had a penetration test finding about "
            "SSL certificate rotation. 5) Compliance audit requires documentation of "
            "all model decisions. Please ensure authorization checks are in place."
        ),
        timestamp=base_time + timedelta(hours=5),
    ))

    # Email 4: Dave from partner company responds
    emails.append(EmailMessage(
        message_id="msg004",
        sender="dave.wilson@partnerinc.com",
        recipients=["alice.chen@techcorp.com", "bob.smith@techcorp.com"],
        cc=["eve.martinez@partnerinc.com"],
        subject="Partnership Update - Joint ML Initiative Budget",
        body=(
            "Hi all, regarding our joint ML initiative: The budget allocation for Q2 "
            "has been approved. Revenue projections look positive. Cost analysis shows "
            "we can reduce expenses by 20% through shared infrastructure. "
            "The quarterly forecast includes funding for 3 additional GPU servers. "
            "Invoice processing for the cloud services is set up. "
            "Payment terms are net-30 as discussed."
        ),
        timestamp=base_time + timedelta(days=1),
    ))

    # Email 5: Eve discusses product roadmap
    emails.append(EmailMessage(
        message_id="msg005",
        sender="eve.martinez@partnerinc.com",
        recipients=["alice.chen@techcorp.com", "carol.davis@techcorp.com"],
        cc=["dave.wilson@partnerinc.com"],
        subject="Product Roadmap - Q3 Feature Planning [PROJ-101]",
        body=(
            "Team, here's the product roadmap for Q3. Sprint 14 backlog includes: "
            "1) User story for real-time prediction API. 2) Feature request for "
            "batch processing dashboard. 3) Milestone: beta launch by July 15. "
            "Requirements document is attached. Design review scheduled for next week. "
            "Customer feedback indicates strong demand for the classification feature. "
            "Release plan targets staging deploy on June 1, production on June 15."
        ),
        timestamp=base_time + timedelta(days=2),
    ))

    # Email 6: Frank (new hire) asks about onboarding
    emails.append(EmailMessage(
        message_id="msg006",
        sender="frank.jones@techcorp.com",
        recipients=["alice.chen@techcorp.com", "bob.smith@techcorp.com"],
        subject="New Team Member - Onboarding Questions",
        body=(
            "Hi, I'm the new ML engineer joining the team. I have questions about: "
            "1) The training pipeline setup. 2) Access to the neural network models. "
            "3) Documentation for the inference system. I have experience with "
            "deep learning and transformer architectures from my previous role. "
            "Looking forward to contributing to the classification and regression tasks."
        ),
        timestamp=base_time + timedelta(days=3),
    ))

    # Email 7: Alice mentors Frank
    emails.append(EmailMessage(
        message_id="msg007",
        sender="alice.chen@techcorp.com",
        recipients=["frank.jones@techcorp.com"],
        cc=["bob.smith@techcorp.com", "carol.davis@techcorp.com"],
        subject="Re: New Team Member - Welcome and Resources",
        body=(
            "Welcome Frank! Here's what you need to know: The training pipeline uses "
            "PyTorch with custom transformers. Our neural network architecture is "
            "documented in the wiki. For the inference system, check the deployment "
            "guide. I'll schedule a deep learning onboarding session. "
            "The dataset is in our feature store - Bob manages the infrastructure. "
            "Carol handles all security and authentication aspects. "
            "Decision: We'll pair you with Bob for infrastructure onboarding."
        ),
        timestamp=base_time + timedelta(days=3, hours=2),
        is_reply=True,
        in_reply_to="msg006",
        thread_id="thread002",
        is_knowledge_sharing=True,
    ))

    # Email 8: Security incident discussion
    emails.append(EmailMessage(
        message_id="msg008",
        sender="carol.davis@techcorp.com",
        recipients=["bob.smith@techcorp.com", "alice.chen@techcorp.com"],
        subject="URGENT: Security Incident - Potential Breach in Auth System",
        body=(
            "URGENT: We detected unusual authentication patterns on the ML API. "
            "The firewall logs show multiple failed authorization attempts. "
            "Incident response plan activated. Immediate actions: 1) Rotate all "
            "SSL certificates. 2) Enable additional encryption on sensitive endpoints. "
            "3) Review vulnerability scan results. 4) Audit all access logs. "
            "Compliance team has been notified. Patch deployment scheduled for tonight."
        ),
        timestamp=base_time + timedelta(days=5),
        priority=EmailPriority.URGENT,
    ))

    # Email 9: Bob on infrastructure response
    emails.append(EmailMessage(
        message_id="msg009",
        sender="bob.smith@techcorp.com",
        recipients=["carol.davis@techcorp.com"],
        cc=["alice.chen@techcorp.com"],
        subject="Re: Security Incident - Infrastructure Response",
        body=(
            "Carol, infrastructure response: 1) Kubernetes network policies updated. "
            "2) Docker containers being recycled with new certificates. "
            "3) Cloud monitoring alerts configured for the breach pattern. "
            "4) AWS security groups locked down. 5) CI/CD pipeline paused until "
            "patch is verified. Load balancer rules updated to block suspicious IPs. "
            "Scaling down non-essential services to reduce attack surface."
        ),
        timestamp=base_time + timedelta(days=5, hours=1),
        is_reply=True,
        in_reply_to="msg008",
    ))

    # Email 10: Dave discusses hiring
    emails.append(EmailMessage(
        message_id="msg010",
        sender="dave.wilson@partnerinc.com",
        recipients=["alice.chen@techcorp.com"],
        subject="Hiring Update - Security Engineer Position",
        body=(
            "Alice, regarding the security engineer hiring: We've shortlisted 3 "
            "candidates for interview. The performance review of current team shows "
            "we need additional expertise in penetration testing and compliance. "
            "Salary range approved. Benefits package includes training budget. "
            "Onboarding plan ready. Team building event scheduled for next month "
            "to integrate new members with the culture."
        ),
        timestamp=base_time + timedelta(days=7),
    ))

    return emails


def run_test_scenario_1(builder: EmailGraphBuilder) -> None:
    """Test Scenario 1: Full Email Ingestion and Graph Construction."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 1: Full Email Ingestion and Graph Construction")
    print("=" * 70)

    emails = create_test_emails()
    stats = builder.ingest_batch(emails)

    print(f"\nIngestion Statistics:")
    print(f"  Emails processed: {stats['emails_processed']}")
    print(f"  Total nodes: {stats['total_nodes']}")
    print(f"  Total edges: {stats['total_edges']}")
    print(f"  Graph density: {builder.graph.density():.4f}")

    # Verify node types
    people = builder.graph.find_nodes_by_type(NodeType.PERSON)
    topics = builder.graph.find_nodes_by_type(NodeType.TOPIC)
    companies = builder.graph.find_nodes_by_type(NodeType.COMPANY)

    print(f"\nNode Breakdown:")
    print(f"  People: {len(people)} - {[p.label for p in people]}")
    print(f"  Topics: {len(topics)} - {[t.label for t in topics[:8]]}")
    print(f"  Companies: {len(companies)} - {[c.label for c in companies]}")

    # Verify connected components
    components = builder.graph.connected_components()
    print(f"\nConnected Components: {len(components)}")
    for i, comp in enumerate(components):
        labels = [builder.graph.get_node(n).label for n in list(comp)[:5] if builder.graph.get_node(n)]
        print(f"  Component {i+1}: {len(comp)} nodes - {labels}")

    assert stats['emails_processed'] == 10, "Should process 10 emails"
    assert stats['total_nodes'] > 10, "Should have many nodes"
    assert stats['total_edges'] > 15, "Should have many edges"
    print("\n✓ Scenario 1 PASSED")


def run_test_scenario_2(builder: EmailGraphBuilder) -> None:
    """Test Scenario 2: Expertise Mapping and Expert Discovery."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 2: Expertise Mapping and Expert Discovery")
    print("=" * 70)

    analyzer = ExpertiseAnalyzer(builder.graph, builder)

    # Find ML experts
    ml_experts = analyzer.find_experts("machine_learning", top_n=3)
    print(f"\nTop ML Experts:")
    for exp in ml_experts:
        person = builder.graph.get_node(exp.person_id)
        print(f"  {person.label if person else exp.person_id}: score={exp.score:.3f}, "
              f"confidence={exp.confidence:.3f}, evidence={exp.evidence_count}")

    # Find security experts
    sec_experts = analyzer.find_experts("security", top_n=3)
    print(f"\nTop Security Experts:")
    for exp in sec_experts:
        person = builder.graph.get_node(exp.person_id)
        print(f"  {person.label if person else exp.person_id}: score={exp.score:.3f}, "
              f"confidence={exp.confidence:.3f}")

    # Get person expertise profile
    alice_expertise = analyzer.get_person_expertise("alice.chen@techcorp.com")
    print(f"\nAlice Chen's Expertise Profile:")
    for exp in alice_expertise[:5]:
        print(f"  {exp.topic}: score={exp.score:.3f}")

    assert len(ml_experts) > 0, "Should find ML experts"
    assert len(sec_experts) > 0, "Should find security experts"
    assert ml_experts[0].score > 0, "Top expert should have positive score"
    print("\n✓ Scenario 2 PASSED")


def run_test_scenario_3(builder: EmailGraphBuilder) -> None:
    """Test Scenario 3: Network Analysis and Collaboration Patterns."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 3: Network Analysis and Collaboration Patterns")
    print("=" * 70)

    net_analyzer = NetworkAnalyzer(builder.graph)

    # Compute metrics for all nodes
    metrics = net_analyzer.compute_all_metrics()
    print(f"\nNetwork Metrics (people only):")
    people = builder.graph.find_nodes_by_type(NodeType.PERSON)
    for person in people:
        m = metrics.get(person.node_id)
        if m:
            print(f"  {person.label}: degree={m.degree_centrality:.3f}, "
                  f"betweenness={m.betweenness_centrality:.3f}, "
                  f"clustering={m.clustering_coefficient:.3f}")

    # PageRank
    pr = net_analyzer.pagerank()
    print(f"\nPageRank (top people):")
    person_pr = [(p.label, pr.get(p.node_id, 0)) for p in people]
    person_pr.sort(key=lambda x: x[1], reverse=True)
    for label, score in person_pr[:5]:
        print(f"  {label}: {score:.4f}")

    # Key people
    key_people = net_analyzer.find_key_people(3)
    print(f"\nKey People:")
    for label, score in key_people:
        print(f"  {label}: {score:.4f}")

    # Collaboration patterns
    collab = CollaborationAnalyzer(builder.graph, net_analyzer)
    patterns = collab.discover_patterns()
    print(f"\nDiscovered Collaboration Patterns:")
    for p in patterns:
        print(f"  [{p.pattern.name}] {p.description}")
        print(f"    Members: {p.members[:4]}")

    assert len(metrics) > 0, "Should compute metrics"
    assert len(pr) > 0, "Should compute PageRank"
    print("\n✓ Scenario 3 PASSED")


def run_test_scenario_4(builder: EmailGraphBuilder) -> None:
    """Test Scenario 4: Query Interface, Trends, Gaps, and Reply-All."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 4: Query Interface, Trends, Gaps, and Reply-All")
    print("=" * 70)

    net_analyzer = NetworkAnalyzer(builder.graph)
    exp_analyzer = ExpertiseAnalyzer(builder.graph, builder)
    query_engine = GraphQueryEngine(builder.graph, builder, exp_analyzer, net_analyzer)

    # Query: Find experts in ML
    result = query_engine.find_experts_in("machine_learning", top_n=3)
    print(f"\nQuery: Find ML Experts (exec: {result.execution_time_ms:.1f}ms)")
    for r in result.results:
        print(f"  {r['person']}: score={r['score']}")

    # Query: Who discussed security with Carol
    result = query_engine.who_discussed_with("carol.davis@techcorp.com", "security")
    print(f"\nQuery: Who discussed security (exec: {result.execution_time_ms:.1f}ms)")
    for r in result.results[:5]:
        print(f"  {r['person']}: topic={r['topic']}, weight={r['weight']}")

    # Query: Path between Dave and Frank
    result = query_engine.find_path_between("dave.wilson@partnerinc.com", "frank.jones@techcorp.com")
    print(f"\nQuery: Path from Dave to Frank (exec: {result.execution_time_ms:.1f}ms)")
    print(f"  Path length: {result.metadata.get('path_length', 'N/A')}")
    for r in result.results:
        print(f"  → {r['label']} ({r['type']})")

    # Query: Person profile
    result = query_engine.get_person_profile("alice.chen@techcorp.com")
    print(f"\nQuery: Alice's Profile (exec: {result.execution_time_ms:.1f}ms)")
    if result.results:
        profile = result.results[0]
        print(f"  Name: {profile['name']}")
        print(f"  Expertise: {profile['expertise'][:3]}")
        print(f"  Network: {profile['network_metrics']}")
        print(f"  Communications: {profile['communication_count']}")

    # Topic trends
    trend_detector = TopicTrendDetector(builder)
    trends = trend_detector.analyze_trends(window_days=30)
    print(f"\nTopic Trends:")
    for t in trends[:5]:
        print(f"  {t.topic}: {t.direction.name} "
              f"(current={t.current_frequency}, change={t.change_rate:.2f})")

    # Knowledge gaps
    gap_identifier = KnowledgeGapIdentifier(builder.graph, exp_analyzer, builder)
    gaps = gap_identifier.identify_gaps()
    print(f"\nKnowledge Gaps ({len(gaps)} found):")
    for gap in gaps[:5]:
        print(f"  [{gap.severity.name}] {gap.description}")
        print(f"    Actions: {gap.suggested_actions[:2]}")

    # Relationship scoring
    scorer = RelationshipScorer(builder.graph, builder)
    alice_id = builder._generate_id("person", "alice.chen@techcorp.com")
    bob_id = builder._generate_id("person", "bob.smith@techcorp.com")
    rel = scorer.score_relationship(alice_id, bob_id)
    print(f"\nRelationship: Alice ↔ Bob")
    print(f"  Overall: {rel.overall_score:.3f}")
    print(f"  Frequency: {rel.frequency_score:.3f}")
    print(f"  Recency: {rel.recency_score:.3f}")
    print(f"  Depth: {rel.depth_score:.3f}")
    print(f"  Diversity: {rel.diversity_score:.3f}")

    # Reply-all enforcement
    enforcer = ReplyAllEnforcer(builder.graph, builder, exp_analyzer)
    test_email = EmailMessage(
        message_id="test_reply",
        sender="bob.smith@techcorp.com",
        recipients=["alice.chen@techcorp.com"],
        subject="Re: ML Model Architecture - Deployment Decision",
        body=(
            "Alice, I've decided we should proceed with the transformer optimization. "
            "The neural network training pipeline will be deployed to Kubernetes next week. "
            "Action item: update the CI/CD pipeline. The security audit passed. "
            "Next steps: schedule the model review meeting."
        ),
        is_reply=True,
    )
    enforcement = enforcer.evaluate_email(test_email)
    print(f"\nReply-All Enforcement:")
    print(f"  Should reply-all: {enforcement.should_reply_all}")
    print(f"  Reason: {enforcement.reason}")
    print(f"  Knowledge value: {enforcement.knowledge_value_score:.3f}")
    print(f"  Missing recipients: {enforcement.missing_recipients}")
    print(f"  Action: {enforcement.recommended_action}")

    # Subgraph query
    result = query_engine.subgraph_around("alice.chen@techcorp.com", depth=1)
    print(f"\nSubgraph around Alice (depth=1):")
    if isinstance(result.results, dict):
        print(f"  Nodes: {len(result.results.get('nodes', []))}")
        print(f"  Edges: {len(result.results.get('edges', []))}")

    assert result.metadata.get("node_count", 0) > 0, "Subgraph should have nodes"
    print("\n✓ Scenario 4 PASSED")


def run_test_scenario_5(builder: EmailGraphBuilder) -> None:
    """Test Scenario 5: Edge Cases and Graph Operations."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 5: Edge Cases and Graph Operations")
    print("=" * 70)

    graph = builder.graph

    # Test node removal
    initial_count = graph.node_count
    test_node = GraphNode(
        node_id="test_remove_1",
        node_type=NodeType.PERSON,
        label="Test Person",
    )
    graph.add_node(test_node)
    assert graph.node_count == initial_count + 1, "Node should be added"

    # Add edge to test node
    people = graph.find_nodes_by_type(NodeType.PERSON)
    if people:
        test_edge = GraphEdge(
            edge_id="test_edge_remove",
            edge_type=EdgeType.COMMUNICATES_WITH,
            source_id="test_remove_1",
            target_id=people[0].node_id,
        )
        graph.add_edge(test_edge)

    # Remove and verify
    graph.remove_node("test_remove_1")
    assert graph.node_count == initial_count, "Node should be removed"
    assert graph.get_node("test_remove_1") is None, "Node should not exist"
    print("  ✓ Node removal works correctly")

    # Test shortest path
    people = graph.find_nodes_by_type(NodeType.PERSON)
    if len(people) >= 2:
        path = graph.shortest_path(people[0].node_id, people[1].node_id)
        if path:
            labels = [graph.get_node(n).label for n in path if graph.get_node(n)]
            print(f"  ✓ Shortest path: {' → '.join(labels)}")
        else:
            print(f"  ✓ No path between {people[0].label} and {people[1].label}")

    # Test label search
    results = graph.find_nodes_by_label("alice")
    print(f"  ✓ Label search 'alice': {len(results)} results")
    assert len(results) >= 1, "Should find Alice"

    # Test edge type filtering
    comm_edges = graph.find_edges_by_type(EdgeType.COMMUNICATES_WITH)
    discuss_edges = graph.find_edges_by_type(EdgeType.DISCUSSES)
    print(f"  ✓ communicates_with edges: {len(comm_edges)}")
    print(f"  ✓ discusses edges: {len(discuss_edges)}")
    assert len(comm_edges) > 0, "Should have communication edges"
    assert len(discuss_edges) > 0, "Should have discussion edges"

    # Test graph statistics
    print(f"  ✓ Graph density: {graph.density():.4f}")
    components = graph.connected_components()
    print(f"  ✓ Connected components: {len(components)}")

    # Test empty email ingestion
    empty_email = EmailMessage(
        message_id="empty_test",
        sender="test@test.com",
        recipients=["other@test.com"],
        subject="",
        body="",
    )
    stats = builder.ingest_email(empty_email)
    print(f"  ✓ Empty email ingested: {stats}")

    # Test batch with duplicate person
    dup_email = EmailMessage(
        message_id="dup_test",
        sender="alice.chen@techcorp.com",
        recipients=["bob.smith@techcorp.com"],
        subject="Duplicate test",
        body="Testing duplicate person handling in the system.",
    )
    pre_count = graph.node_count
    builder.ingest_email(dup_email)
    # Should not create duplicate person nodes
    alice_nodes = graph.find_nodes_by_label("alice")
    assert len(alice_nodes) <= 2, "Should not create excessive duplicate nodes"
    print(f"  ✓ Duplicate person handling: OK")

    print("\n✓ Scenario 5 PASSED")


# ---------------------------------------------------------------------------
# Main Demo
# ---------------------------------------------------------------------------


def main() -> None:
    """
    Main demonstration of the V136 AI Email Knowledge Graph system.
    Runs all test scenarios and displays comprehensive results.
    """
    print("=" * 70)
    print("  V136 AI EMAIL KNOWLEDGE GRAPH")
    print("  Building Living Knowledge Graphs from Email Communications")
    print("=" * 70)

    # Initialize components
    graph = KnowledgeGraph()
    builder = EmailGraphBuilder(graph)

    # Run all test scenarios
    run_test_scenario_1(builder)
    run_test_scenario_2(builder)
    run_test_scenario_3(builder)
    run_test_scenario_4(builder)
    run_test_scenario_5(builder)

    # Final summary
    print("\n" + "=" * 70)
    print("  FINAL GRAPH SUMMARY")
    print("=" * 70)
    print(f"  Total Nodes: {graph.node_count}")
    print(f"  Total Edges: {graph.edge_count}")
    print(f"  Graph Density: {graph.density():.4f}")
    print(f"  Connected Components: {len(graph.connected_components())}")

    people = graph.find_nodes_by_type(NodeType.PERSON)
    topics = graph.find_nodes_by_type(NodeType.TOPIC)
    companies = graph.find_nodes_by_type(NodeType.COMPANY)
    projects = graph.find_nodes_by_type(NodeType.PROJECT)

    print(f"\n  Node Types:")
    print(f"    People: {len(people)}")
    print(f"    Topics: {len(topics)}")
    print(f"    Companies: {len(companies)}")
    print(f"    Projects: {len(projects)}")

    edge_types = [
        EdgeType.COMMUNICATES_WITH,
        EdgeType.DISCUSSES,
        EdgeType.BELONGS_TO,
        EdgeType.WORKS_ON,
        EdgeType.MENTIONS,
    ]
    print(f"\n  Edge Types:")
    for et in edge_types:
        count = len(graph.find_edges_by_type(et))
        print(f"    {et.value}: {count}")

    print("\n" + "=" * 70)
    print("  ALL TEST SCENARIOS PASSED ✓")
    print("=" * 70)


if __name__ == "__main__":
    main()
